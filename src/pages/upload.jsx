import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { uploadApi } from "../api/uploadApi";

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png,.dcm";
const MAX_SIZE_MB = 50;

export default function Upload() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const validateFile = (file) => {
    const sizeMb = file.size / 1024 / 1024;
    if (sizeMb > MAX_SIZE_MB) {
      return `File exceeds ${MAX_SIZE_MB}MB limit.`;
    }
    const name = file.name.toLowerCase();
    const isPdf = name.endsWith(".pdf");
    const isImage =
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg") ||
      name.endsWith(".png") ||
      name.endsWith(".dcm");
    if (!isPdf && !isImage) {
      return "Please upload an X-Ray image (JPG, PNG, DICOM) or PDF file.";
    }
    return null;
  };

  const selectFile = (file) => {
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }
    setError("");
    setSelectedFile(file);
  };

  const handleFiles = (fileList) => {
    const file = fileList?.[0];
    if (file) selectFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const response = await uploadApi.uploadFile(selectedFile);
      navigate("/reports", {
        state: {
          uploadResponse: response,
          uploadData: response.data,
          fromUpload: true,
        },
      });
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Header />
      <main className="upload-page">
        <div className="container">
          <div className="page-header">
            <h1>Upload Medical Files</h1>
            <p className="page-subtitle">
              Upload your X-rays, MRI scans, CT scans, or lab reports for AI-powered analysis
            </p>
          </div>

          <div
            className="upload-zone"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={handleBrowseClick}
            style={{ opacity: uploading ? 0.7 : 1, pointerEvents: uploading ? "none" : "auto" }}
          >
            <div className="upload-zone__icon">{uploading ? "⏳" : "☁"}</div>
            <div className="upload-zone__text">
              {uploading
                ? "Uploading and running AI analysis — this may take 1–3 minutes. Please keep this page open."
                : "Drag and drop your file here or click to browse"}
            </div>
            <div className="upload-zone__subtext">
              Supported: X-Ray images (JPG, PNG, DICOM) or PDF (up to {MAX_SIZE_MB}MB)
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              style={{ display: "none" }}
              onChange={handleInputChange}
              disabled={uploading}
            />
          </div>

          {error && (
            <div
              role="alert"
              style={{
                color: "#dc2626",
                marginTop: "1rem",
                padding: "0.75rem 1rem",
                background: "rgba(220,38,38,0.08)",
                borderRadius: "8px",
              }}
            >
              {error}
            </div>
          )}

          {selectedFile && (
            <div className="file-list" style={{ marginTop: "1rem" }}>
              <div className="file-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <span>
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={clearFile}
                    disabled={uploading}
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Analyze File"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="supported-files">
            <h2 className="section-title">Supported X-Ray Types</h2>
            <div className="file-types-grid">
              <div className="file-type-card">
                <div className="file-type-icon">🦴</div>
                <h3>Bone X-Rays</h3>
                <p className="file-format">DICOM, JPG, PNG</p>
                <p className="file-description">Fractures, bone alignment, and skeletal</p>
              </div>

              <div className="file-type-card">
                <div className="file-type-icon">🫁</div>
                <h3>Chest X-Rays</h3>
                <p className="file-format">DICOM, JPG, PNG</p>
                <p className="file-description">Lung conditions, infections, and respiratory</p>
              </div>

              <div className="file-type-card">
                <div className="file-type-icon">🧠</div>
                <h3>Advanced Detection</h3>
                <p className="file-format">DICOM, JPG, PNG</p>
                <p className="file-description">AI-powered detection of hidden patterns</p>
              </div>

              <div className="file-type-card">
                <div className="file-type-icon">⚡</div>
                <h3>Fast Results</h3>
                <p className="file-format">PDF, JPG, PNG</p>
                <p className="file-description">Get quick and reliable diagnostic reports</p>
              </div>
            </div>
          </div>

          <div className="instructions">
            <div className="instructions-card">
              <h3>Upload Instructions</h3>
              <ul className="instructions-list">
                <li>Ensure images are clear and well-lit</li>
                <li>Maximum file size: 50MB per file</li>
                <li>Upload one X-Ray image or PDF at a time</li>
                <li>All data is encrypted and HIPAA compliant</li>
                <li>Analysis typically takes 2-5 minutes</li>
                <li>Results will appear in your reports page</li>
              </ul>
            </div>
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
                <li><button type="button">Help Center</button></li>
                <li><button type="button">API Documentation</button></li>
                <li><button type="button">Medical Guidelines</button></li>
                <li><button type="button">Research Papers</button></li>
                <li><button type="button">Blog</button></li>
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
                <button type="button">Privacy Policy</button>
                <button type="button">Terms of Service</button>
                <button type="button">Cookie Policy</button>
                <button type="button">Accessibility</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
