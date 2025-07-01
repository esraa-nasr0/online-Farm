import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import logo from "../../Assets/Img/WhatsAppLogo.jpeg";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
    const { Authorization, setAuthorization } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const userRole = Authorization ? jwtDecode(Authorization).role : null;
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    // Only show sidebar toggle on pages where sidebar should appear
    const showSidebarToggle = Authorization && !['/', '/home', '/register', '/login', '/dashboard','/forgetpassword','/verifyotp','/resetpassword'].includes(location.pathname);

    function LogOut() {
        localStorage.removeItem("Authorization");
        setAuthorization(null);
        navigate("/");
    }

    function toggleLanguage() {
        const newLanguage = language === "en" ? "ar" : "en";
        i18n.changeLanguage(newLanguage);
        setLanguage(newLanguage);
    }

    return (
        <nav className="main-navbar">
            <div className="navbar-inner">
                {/* Logo and Brand */}
                <div className="navbar-logo">
                    <img src={logo} alt="Logo" className="navbar-logo-img" />
                    <span className="navbar-title">ONLINE FARM</span>
                </div>

                {/* Navigation Links - Center */}
                <div className="navbar-links">
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                    {/* <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link> */}
                    <Link to="/homeServices" className={location.pathname === '/homeServices' ? 'active' : ''}>Services</Link>
                    {(userRole === "admin" || isAdmin) && (
                        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="navbar-actions">
                    {/* Language Toggle */}
                    <button 
                        onClick={toggleLanguage} 
                        className="language-toggle"
                    >
                        {language === "en" ? "العربية" : "English"}
                    </button>

                    {/* Auth Buttons */}
                    {Authorization ? (
                        <button onClick={LogOut} className="navbar-login-btn">Logout</button>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-login-btn">Sign in</Link>
                            <Link to="/register" className="navbar-signup-btn">Sign up</Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
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
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    {/* <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link> */}
                    <Link to="/homeServices" onClick={() => setMobileMenuOpen(false)}>Services</Link>
                    {(userRole === "admin" || isAdmin) && (
                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                    )}
                    <div className="mobile-auth-buttons">
                        {Authorization ? (
                            <button onClick={() => { LogOut(); setMobileMenuOpen(false); }} className="navbar-login-btn">Logout</button>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="navbar-login-btn">Sign in</Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="navbar-signup-btn">Sign up</Link>
                            </>
                        )}
                    </div>
                    <button 
                        onClick={toggleLanguage} 
                        className="language-toggle mobile-language-toggle"
                    >
                        {language === "en" ? "العربية" : "English"}
                    </button>
                </div>
            )}
        </nav>
    );
}