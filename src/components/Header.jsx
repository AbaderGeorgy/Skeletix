import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/home.css";
import "../styles/header-profile.css";
import { useAuth } from "../context/AuthContext";
import { getStoredUser, isAuthenticated } from "../utils/authUtils";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const profileRef = useRef(null);
  const loggedIn = isAuthenticated();
  const displayName = user?.name || getStoredUser()?.name || "User";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
    document.body.style.overflow = "";
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  useEffect(() => {
    if (!profileOpen) return undefined;

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/", { replace: true });
  };

  const toggleProfile = () => {
    setProfileOpen((open) => !open);
  };

  return (
    <header className="header">
      <div className="container header__container">
        <div className="logo">
          <img
            src="https://i.postimg.cc/dVxJWzgh/11111.png"
            alt="MedLab Logo"
            className="logo__img"
          />
          <span className="logo__text">
            Skeleti-
            <span className="edit" style={{ color: "#0EA5E9" }}>
              <img
                src="https://i.postimg.cc/dVxJWzgh/11111.png"
                className="logo_img_1"
                alt="Skeleti-x logo"
              />
            </span>
          </span>
        </div>

        <nav className={`nav ${menuOpen ? "nav--open" : ""}`}>
          <Link
            to="/home"
            className={`nav__link ${location.pathname === "/home" ? "nav__link--active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/upload"
            className={`nav__link ${location.pathname === "/upload" ? "nav__link--active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Upload
          </Link>
          <Link
            to="/dashboard"
            className={`nav__link ${location.pathname === "/dashboard" ? "nav__link--active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/reports"
            className={`nav__link ${location.pathname === "/reports" ? "nav__link--active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Reports
          </Link>
          <Link
            to="/education"
            className={`nav__link ${location.pathname === "/education" ? "nav__link--active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Education
          </Link>
          <Link
            to="/chatbot"
            className={`nav__link ${location.pathname === "/chatbot" ? "nav__link--active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Chatbot
          </Link>
        </nav>

        <div className="header__actions">
          {!loggedIn ? (
            <Link to="/" className="btn_1 btn--primary header-cta">
              Get Started Free
            </Link>
          ) : (
            <div
              className={`profile-menu ${profileOpen ? "profile-menu--open" : ""}`}
              ref={profileRef}
            >
              <button
                type="button"
                className="profile-menu__trigger"
                onClick={toggleProfile}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label="User profile menu"
              >
                <span className="user-icon" aria-hidden="true">
                  👤
                </span>
                <span className="profile-menu__name">{displayName}</span>
                <span
                  className={`profile-menu__chevron ${profileOpen ? "profile-menu__chevron--open" : ""}`}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>

              <div
                className={`profile-menu__dropdown ${profileOpen ? "profile-menu__dropdown--visible" : ""}`}
                role="menu"
              >
                <button
                  type="button"
                  className="profile-menu__item"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="header__right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            type="button"
            aria-label="Toggle dark mode"
          >
            <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
              🌙
            </span>
            <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
              ☀️
            </span>
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}
    </header>
  );
}

export default Header;
