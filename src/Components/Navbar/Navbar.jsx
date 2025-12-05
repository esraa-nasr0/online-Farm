// src/components/Navbar/Navbar.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { clearToken } from "../../utils/authToken";
import { FaBars, FaTimes } from "react-icons/fa";
import { GrLanguage } from "react-icons/gr";
import logo from "../../Assets/Img/WhatsAppLogo.jpeg";
import "./Navbar.css";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const { Authorization, setAuthorization } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  // لو حابة تبدأ باللغة المحفوظة في localStorage:
  const savedLang = localStorage.getItem("lang") || i18n.language;
  const [language, setLanguage] = useState(savedLang);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const userRole = Authorization ? jwtDecode(Authorization).role : null;
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // map لأسماء اللغات اللى هتظهر جنب الأيقونة
  const languageLabels = {
    en: "English",
    ar: "العربية",
    ur: "اردو",
  };

  // Logout
  function LogOut() {
    clearToken();              // نمسح الـ token من الكوكيز
    setAuthorization(null);    // نفضي الـ context
    localStorage.removeItem("isAdmin");
    navigate("/");
  }

  // Change Language
  function changeLang(lang) {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    document.dir = lang === "ar" || lang === "ur" ? "rtl" : "ltr";
    setShowLangMenu(false);
  }

  return (
    <nav className="main-navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="navbar-logo-img" />
          <span className="navbar-title" style={{ color: "#21763e" }}>
            MAZRAA ONLINE
          </span>
        </div>

        {/* Links */}
        <div className="navbar-links">
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            Home
          </Link>
          <Link
            to="/homeServices"
            className={location.pathname === "/homeServices" ? "active" : ""}
          >
            Services
          </Link>
          {(userRole === "admin" || isAdmin) && (
            <Link
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "active" : ""}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="navbar-actions">
          {/* Language Dropdown */}
          <div className="language-dropdown">
            <button
              className="language-icon-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
            >
              <GrLanguage size={22} />
              {/* 👇 هنا اسم اللغة المختارة */}
              <span className="language-current-label">
                {languageLabels[language] || language.toUpperCase()}
              </span>
            </button>

            {showLangMenu && (
              <div className="language-menu">
                <button onClick={() => changeLang("en")}>English</button>
                <button onClick={() => changeLang("ar")}>العربية</button>
                <button onClick={() => changeLang("ur")}>اردو</button>
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          {Authorization ? (
            <button onClick={LogOut} className="navbar-login-btn">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="navbar-login-btn">
                Sign in
              </Link>
              <Link to="/register" className="navbar-signup-btn">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link
            to="/homeServices"
            onClick={() => setMobileMenuOpen(false)}
          >
            Services
          </Link>

          {(userRole === "admin" || isAdmin) && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {/* Auth */}
          <div className="mobile-auth-buttons">
            {Authorization ? (
              <button
                onClick={() => {
                  LogOut();
                  setMobileMenuOpen(false);
                }}
                className="navbar-login-btn"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="navbar-login-btn"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="navbar-signup-btn"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Language in Mobile */}
          <div className="language-dropdown mobile-lang">
            <button
              className="language-icon-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
            >
              <GrLanguage size={22} />
              {/* 👇 برضه في الموبايل نكتب اسم اللغة */}
              <span className="language-current-label">
                {languageLabels[language] || language.toUpperCase()}
              </span>
            </button>

            {showLangMenu && (
              <div className="language-menu">
                <button onClick={() => changeLang("en")}>English</button>
                <button onClick={() => changeLang("ar")}>العربية</button>
                <button onClick={() => changeLang("ur")}>اردو</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
