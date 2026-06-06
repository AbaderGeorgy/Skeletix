import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import ReportsOverview from "../components/ReportsOverview";
import { reportsApi } from "../api/reportsApi";
import { useAuth } from "../context/AuthContext";
import {
  buildAnalysisRecord,
  getAnalysisHistory,
  getCurrentUserId,
  saveAnalysisToHistory,
  subscribeToHistoryUpdates,
} from "../services/analysisHistoryService";
import { buildReportsOverviewMetrics } from "../utils/reportsOverviewMetrics";
import {
  flattenRecommendations,
  formatConfidence,
  formatDate,
  getReportTitle,
  normalizePrediction,
} from "../utils/reportHelpers";
import { downloadAnalysisPdf } from "../utils/generateAnalysisPdf";

const isRetryableReportError = (err) =>
  !err.status ||
  err.status === 500 ||
  err.status === 502 ||
  err.status === 503 ||
  err.status === 504;

const pollQuickResult = async (maxAttempts = 15, delayMs = 3000) => {
  let lastError = null;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const result = await reportsApi.getQuickResult();
      if (result?.data) return result;
    } catch (err) {
      lastError = err;
      if (!isRetryableReportError(err)) throw err;
    }
    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  if (lastError) throw lastError;
  return null;
};


export default function Reports() {
  const location = useLocation();
  const navigationState = location.state;
  const { user } = useAuth();
  const savedToHistoryRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const uploadData =
    navigationState?.uploadData || navigationState?.uploadResponse?.data || null;
  const [quickResult, setQuickResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState("");
  const [history, setHistory] = useState([]);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [pdfError, setPdfError] = useState("");

  const userId = user?.id || getCurrentUserId();

  const loadHistory = useCallback(() => {
    setHistory(getAnalysisHistory(userId));
  }, [userId]);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError("");
    setStatsError("");

    try {
      const fromUpload = navigationState?.fromUpload;
      let quickResponse = null;

      if (fromUpload) {
        quickResponse = await pollQuickResult();
      } else {
        try {
          quickResponse = await reportsApi.getQuickResult();
        } catch (err) {
          if (err.status !== 500) throw err;
        }
      }

      if (quickResponse?.data) {
        setQuickResult(quickResponse.data);
      }

      try {
        const statsResponse = await reportsApi.getDashboardStats();
        setStats(statsResponse?.data || null);
      } catch (statsErr) {
        setStatsError(statsErr.message || "Failed to load report statistics.");
      }

      loadHistory();
    } catch (err) {
      setError(err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, [navigationState?.fromUpload, loadHistory]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  useEffect(() => {
    return subscribeToHistoryUpdates(loadHistory);
  }, [loadHistory]);

  useEffect(() => {
    if (!quickResult || savedToHistoryRef.current || !userId) return;

    const record = buildAnalysisRecord({
      uploadData,
      quickResult,
      patientName: user?.name,
      userId,
    });

    if (saveAnalysisToHistory(record)) {
      savedToHistoryRef.current = true;
      loadHistory();
    }
  }, [quickResult, uploadData, user, userId, loadHistory]);

  const overviewMetrics = useMemo(
    () =>
      buildReportsOverviewMetrics({
        apiStats: stats,
        history,
        quickResult,
      }),
    [stats, history, quickResult]
  );

  const confidencePercent = quickResult?.confidence != null
    ? Math.round((quickResult.confidence <= 1 ? quickResult.confidence * 100 : quickResult.confidence))
    : 0;

  const recommendationSections = flattenRecommendations(quickResult?.recommendation);
  const hasReport = Boolean(quickResult || uploadData || history.length > 0);
  const isEmpty = !loading && !error && !hasReport;
  const showOverview = !error;

  const handleDownloadPdf = async () => {
    if (!quickResult) {
      setPdfError("No analysis data available to export.");
      return;
    }

    const userId = user?.id || getCurrentUserId();
    if (!userId) {
      setPdfError("You must be logged in to download reports.");
      return;
    }

    setPdfError("");
    setPdfDownloading(true);

    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const record = buildAnalysisRecord({
        uploadData,
        quickResult,
        patientName: user?.name,
        userId,
      });

      record.analysisTitle = getReportTitle(uploadData, quickResult);

      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          downloadAnalysisPdf(record);
          resolve();
        });
      });
    } catch {
      setPdfError("Failed to generate PDF report. Please try again.");
    } finally {
      setPdfDownloading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="reports-page">
        <div className="reports-header">
          <div className="container">
            <div className="reports-header__content">
              <h1>AI Analysis Reports</h1>
              <p>View and download your medical imaging analysis reports</p>
            </div>
          </div>
        </div>

        <div className="reports-content">
          <div className="container">
            {loading && (
              <div className="reports-state" style={{ textAlign: "center", padding: "2rem 1rem" }}>
                <p>Loading your latest analysis...</p>
              </div>
            )}

            {!loading && error && (
              <div
                className="reports-state"
                role="alert"
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#dc2626",
                  background: "rgba(220,38,38,0.08)",
                  borderRadius: "12px",
                  marginBottom: "2rem",
                }}
              >
                <h3>Unable to load report</h3>
                <p>{error}</p>
                <button type="button" className="btn btn--primary" onClick={loadReports} style={{ marginTop: "1rem" }}>
                  Retry
                </button>
              </div>
            )}

            {isEmpty && (
              <div className="reports-state" style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <h3>No reports yet</h3>
                <p>Upload an X-Ray image or PDF to generate your first AI analysis report.</p>
              </div>
            )}

            {!loading && !error && quickResult && (
              <>
                <div className="detailed-report-card">
                  <div className="report-header">
                    <div className="report-title">
                      <h3>{getReportTitle(uploadData, quickResult)}</h3>
                      <p className="report-date">
                        {uploadData?.createdAt
                          ? `Analyzed on ${formatDate(uploadData.createdAt)}`
                          : "Latest analysis from your account"}
                      </p>
                    </div>
                    <div className="report-actions-column">
                      <div className="report-actions" style={{ width: "60%" }}>
                        {quickResult?.image_url && (
                          <a
                            href={quickResult.image_url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn--secondary report-actions__btn "
                          >
                            View Result Image
                          </a>
                        )}
                        {quickResult && (
                          <button
                            type="button"
                            className="btn btn--primary report-actions__btn"
                            onClick={handleDownloadPdf}
                            disabled={pdfDownloading}
                          >
                            {pdfDownloading ? "Generating PDF..." : "Download PDF Report"}
                          </button>
                        )}
                      </div>
                      {pdfError && (
                        <p className="report-pdf-error" role="alert">
                          {pdfError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="report-body">
                    <div className="report-summary">
                      <div className="confidence-score">
                        <h4>AI Confidence Score</h4>
                        <div className="confidence-bar">
                          <div className="progress">
                            <div
                              className="progress__bar"
                              style={{ width: `${confidencePercent}%` }}
                            />
                          </div>
                          <span className="confidence-value">
                            {formatConfidence(quickResult?.confidence)}
                          </span>
                        </div>
                      </div>

                      <div className="report-type">
                        <h4>Prediction Result</h4>
                        <div className="type-tag">
                          {normalizePrediction(quickResult?.prediction)}
                        </div>
                      </div>

                      <div className="report-type">
                        <h4>Disease / Condition</h4>
                        <div className="type-tag">
                          {quickResult?.recommendation?.title ||
                            normalizePrediction(quickResult?.prediction) ||
                            "—"}
                        </div>
                      </div>
                    </div>

                    <div className="findings-section">
                      <h4>Analysis Result</h4>
                      <ul className="findings-list">
                        <li>
                          <strong>Prediction:</strong>{" "}
                          {normalizePrediction(quickResult?.prediction) || "Pending"}
                        </li>
                        <li>
                          <strong>Detections:</strong> {quickResult?.detections ?? "—"}
                        </li>
                        {quickResult?.recommendation?.urgency && (
                          <li>
                            <strong>Urgency:</strong> {quickResult.recommendation.urgency}
                          </li>
                        )}
                      </ul>
                    </div>

                    {recommendationSections.length > 0 && (
                      <div className="recommendations">
                        <h4>Recommendations</h4>
                        {recommendationSections.map((section, index) => (
                          <div key={index} style={{ marginBottom: "1rem" }}>
                            <strong>{section.label}</strong>
                            <ul className="findings-list">
                              {section.steps.map((step, stepIndex) => (
                                <li key={stepIndex}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {uploadData && (
                      <div className="analysis-summary">
                        <h4>Uploaded File Information</h4>
                        <ul className="findings-list">
                          <li><strong>File Name:</strong> {uploadData.fileName || "—"}</li>
                          <li><strong>File Type:</strong> {uploadData.fileType || "—"}</li>
                          <li><strong>Format:</strong> {uploadData.fileFormat || "—"}</li>
                          <li>
                            <strong>Size:</strong>{" "}
                            {uploadData.fileSize
                              ? `${(uploadData.fileSize / 1024).toFixed(1)} KB`
                              : "—"}
                          </li>
                          <li><strong>Status:</strong> {uploadData.status || "—"}</li>
                          <li><strong>Priority:</strong> {uploadData.priority || "—"}</li>
                        </ul>
                      </div>
                    )}

                    {uploadData?.fileType === "PDF" && uploadData?.analysisReports?.length > 0 && (
                      <div className="analysis-summary">
                        <h4>Extracted PDF Data</h4>
                        <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
                          {JSON.stringify(uploadData.analysisReports, null, 2)}
                        </pre>
                      </div>
                    )}

                    {quickResult?.image_url && (
                      <div className="analysis-summary">
                        <h4>Result Visualization</h4>
                        <img
                          src={quickResult.image_url}
                          alt="Analysis result"
                          style={{ maxWidth: "100%", borderRadius: "8px", marginTop: "0.5rem" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {showOverview && (
              <ReportsOverview
                metrics={overviewMetrics}
                loading={loading}
                error={!loading ? statsError : ""}
                onRetry={loadReports}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__content">
            <div className="footer_section footer_brand">
              <div className="footer__logo">
                <img
                  src="https://i.postimg.cc/dVxJWzgh/11111.png"
                  alt="MedLab Logo"
                  className="logo__img"
                />
                <span className="logo__text" style={{ color: "white" }}>
                  Skeleti-
                  <span className="edit">
                    <img src="https://i.postimg.cc/dVxJWzgh/11111.png" className="logo_img_1" alt="Skeleti-x logo" />
                  </span>
                </span>
              </div>
              <p className="footer__description">
                Transform your medical imaging with AI-powered analysis. Fast, accurate, and patient-friendly results.
              </p>
              <div className="footer__social">
                <h5>Follow Us</h5>
                <div className="social-links">
                  <button type="button" className="social-link">🐦 Twitter</button>
                  <button type="button" className="social-link">🗺 LinkedIn</button>
                  <button type="button" className="social-link">📱 Facebook</button>
                </div>
              </div>
            </div>

            <div className="footer__section">
              <h4>Quick Links</h4>
              <ul className="footer__links">
                <li><Link to="/upload">Upload Files</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/reports">View Reports</Link></li>
                <li><Link to="/chatbot">AI Assistant</Link></li>
                <li><Link to="/education">Education Center</Link></li>
              </ul>
            </div>

            <div className="footer__section">
              <h4>Resources</h4>
              <ul className="footer__links">
                <li><button type="button" className="footer-link-button">Help Center</button></li>
                <li><button type="button" className="footer-link-button">API Documentation</button></li>
                <li><button type="button" className="footer-link-button">Medical Guidelines</button></li>
                <li><button type="button" className="footer-link-button">Research Papers</button></li>
                <li><button type="button" className="footer-link-button">Blog</button></li>
              </ul>
            </div>

            <div className="footer__section">
              <h4>Newsletter</h4>
              <p className="footer__newsletter-text">Stay updated with the latest in AI medical technology</p>
              <div className="newsletter-form">
                <input className="newsletter-input" placeholder="Enter your email" type="email" />
                <button className="newsletter-btn">Subscribe</button>
              </div>
              <div className="footer__badges">
                <div className="compliance-badge">
                  <span className="badge-icon">🛡️</span>
                  <span className="badge-text">HIPAA Compliant</span>
                </div>
                <div className="compliance-badge">
                  <span className="badge-icon">🏆</span>
                  <span className="badge-text">FDA Approved</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            <div className="footer__bottom-content">
              <div className="footer__copyright">
                <p>© 2025 Skeleti-x. All rights reserved.</p>
              </div>
              <div className="footer__legal">
                <button type="button" className="footer-link-button">Privacy Policy</button>
                <button type="button" className="footer-link-button">Terms of Service</button>
                <button type="button" className="footer-link-button">Cookie Policy</button>
                <button type="button" className="footer-link-button">Accessibility</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
