import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Dashboard.css";
import Header from "../components/Header";
import ActivityCard from "../components/ActivityCard";
import StatCard, { StatCardSkeleton } from "../components/StatCard";
import { dashboardApi } from "../api/dashboardApi";
import { useAuth } from "../context/AuthContext";
import {
  getAnalysisHistory,
  getCurrentUserId,
  subscribeToHistoryUpdates,
  syncQuickResultToHistory,
} from "../services/analysisHistoryService";
import { buildDashboardMetrics } from "../utils/dashboardMetrics";

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const userId = user?.id || getCurrentUserId();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [reportsStats, setReportsStats] = useState(null);
  const [quickResult, setQuickResult] = useState(null);
  const [activities, setActivities] = useState([]);

  const loadHistory = useCallback(() => {
    setActivities(getAnalysisHistory(userId));
  }, [userId]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { dashboard, reportsStats: stats, quickResult: latestResult } =
        await dashboardApi.getDashboardMetrics();
      setDashboardData(dashboard);
      setReportsStats(stats);
      setQuickResult(latestResult);

      if (latestResult?.prediction && userId) {
        syncQuickResultToHistory({
          quickResult: latestResult,
          uploadData: dashboard?.lastAnalyzedFile ?? null,
          patientName: user?.name,
          userId,
        });
      }

      loadHistory();
    } catch (err) {
      setError(err.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [loadHistory, user?.name, userId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    return subscribeToHistoryUpdates(loadHistory);
  }, [loadHistory]);

  useEffect(() => {
    loadHistory();
  }, [location.pathname, loadHistory]);

  const metrics = useMemo(
    () =>
      buildDashboardMetrics({
        dashboardData,
        reportsStats,
        activities,
        quickResult,
      }),
    [dashboardData, reportsStats, activities, quickResult]
  );

  const displayName = user?.name?.split(" ")[0] || "there";

  return (
    <>
      <Header />

      <main className="dashboard-page">
        <div className="dashboard-header">
          <div className="container">
            <div className="dashboard-header__content">
              <h1>Welcome back, {displayName}!</h1>
              <p>Here's an overview of your medical files and reports</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="container">
            {loading && (
              <div className="stats-grid" aria-busy="true" aria-label="Loading dashboard statistics">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </div>
            )}

            {!loading && error && (
              <div
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
                <p>{error}</p>
                <button type="button" className="btn btn--primary" onClick={loadDashboard}>
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="stats-grid">
                  <StatCard
                    icon="📁"
                    value={metrics.totalFiles}
                    label="Total Files Uploaded"
                  />
                  <StatCard
                    icon="📄"
                    value={metrics.totalReports}
                    label="Reports Generated"
                  />
                  <StatCard
                    icon="✅"
                    value={metrics.completedAnalyses}
                    label="Completed Analyses"
                  />
                  <StatCard
                    icon="🕒"
                    value={metrics.lastAnalysis}
                    label="Last Analysis"
                    isTextValue
                  />
                </div>

                <div className="dashboard-section">
                  <h2 className="section-title">Recent Activity</h2>
                  {activities.length > 0 ? (
                    <div className="activity-grid activity-grid--history">
                      {activities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                      ))}
                    </div>
                  ) : (
                    <p style={{ opacity: 0.8 }}>
                      No recent activity yet.{" "}
                      <Link to="/upload">Upload a file</Link> to generate your first analysis report.
                    </p>
                  )}
                </div>

                <div className="dashboard-section">
                  <h2 className="section-title">Quick Actions</h2>
                  <div className="actions-grid">
                    <Link
                      to="/upload"
                      className="action-card"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="action-icon">📤</div>
                      <h3>Upload New Files</h3>
                      <p>Add new medical images or reports</p>
                    </Link>
                    <Link
                      to="/reports"
                      className="action-card"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="action-icon">📋</div>
                      <h3>View All Reports</h3>
                      <p>Access your complete report history</p>
                    </Link>
                    <Link
                      to="/chatbot"
                      className="action-card"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="action-icon">💬</div>
                      <h3>AI Assistant</h3>
                      <p>Get help understanding your results</p>
                    </Link>
                    <Link
                      to="/education"
                      className="action-card"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="action-icon">📚</div>
                      <h3>Learn More</h3>
                      <p>Educational resources about your health</p>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__content">
            <div className="footer__section footer__brand">
              <div className="footer__logo">
                <img
                  src="https://i.postimg.cc/dVxJWzgh/11111.png"
                  alt="MedLab Logo"
                  className="logo__img"
                />
                <span className="logo__text" style={{color:"white" }}>
                  Skeleti-<span className="edit" style={{ color: "#0EA5E9" }}><img src="https://i.postimg.cc/dVxJWzgh/11111.png" className="logo_img_1" alt="Skeleti-x logo" /></span>
                </span>
              </div>
              <p className="footer__description">
                Transform your medical imaging with AI-powered analysis. Fast, accurate, and patient-friendly results.
              </p>

              <div className="footer__social">
                <h5 className="footer__social-title">Follow Us</h5>
                <div className="social-links">
                  <button type="button" className="social-link">🐦 Twitter</button>
                  <button type="button" className="social-link">🗺 LinkedIn</button>
                  <button type="button" className="social-link">📱 Facebook</button>
                </div>
              </div>
            </div>

            <div className="footer__section">
              <h4 className="footer__section-title">Quick Links</h4>
              <ul className="footer__links">
                <li><Link to="/upload">Upload Files</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/reports">View Reports</Link></li>
                <li><Link to="/chatbot">AI Assistant</Link></li>
                <li><Link to="/education">Education Center</Link></li>
              </ul>
            </div>

            <div className="footer__section">
              <h4 className="footer__section-title">Resources</h4>
              <ul className="footer__links">
                <li><button type="button" className="footer-link-button">Help Center</button></li>
                <li><button type="button" className="footer-link-button">API Documentation</button></li>
                <li><button type="button" className="footer-link-button">Medical Guidelines</button></li>
                <li><button type="button" className="footer-link-button">Research Papers</button></li>
                <li><button type="button" className="footer-link-button">Blog</button></li>
              </ul>
            </div>

            <div className="footer__section">
              <h4 className="footer__section-title">Newsletter</h4>
              <p className="footer__newsletter-text">
                Stay updated with the latest in AI medical technology
              </p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" className="newsletter-input" />
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
                <p>&copy; 2025 Skeleti-x. All rights reserved.</p>
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
