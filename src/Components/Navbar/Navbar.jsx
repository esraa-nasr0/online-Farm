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
        navigate("/home");
    }

    function toggleLanguage() {
        const newLanguage = language === "en" ? "ar" : "en";
        i18n.changeLanguage(newLanguage);
        setLanguage(newLanguage);
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light fixed-top" style={{ 
            backgroundColor: "#fff", 
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
            padding: "0.75rem 2rem" 
        }}>
            <div className="container-fluid">
                <div className="d-flex align-items-center w-100">
                    {/* Sidebar Toggle (only shown when authorized and on certain pages) */}
                     {showSidebarToggle && (
                        <button 
                            className="sidebar-toggle-btn me-3" 
                            onClick={toggleSidebar}
                            style={{
                                background: "none",
                                border: "none",
                                fontSize: "1.5rem",
                                color: "#9cbd81",
                                transition: "all 0.3s ease"
                            }}
                        >
                            {isSidebarOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    )}
                    
                    {/* Logo */}
                    <Link className="navbar-brand d-flex align-items-center me-auto" to="/">
                        <img src={logo} alt="Logo" style={{ width: "100px", height: "45px", marginRight: "10px" }} />
                        <span style={{  color: "#0C0D0E", fontSize: "1.75rem" }}>ONLINE FARM</span>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="navbar-toggler ms-auto" 
                        type="button" 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-expanded={mobileMenuOpen}
                        aria-label="Toggle navigation"
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "1.5rem",
                            color: "#9cbd81"
                        }}
                    >
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    {/* Navigation Content */}
                    <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
                        {/* Navigation Links */}
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                            {Authorization && (
                                <>
                                    <li className="nav-item mx-2">
                                        <Link 
                                            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                                            to="/" 
                                            style={{ color: "#0C0D0E", fontSize: "1.1rem" }}
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li className="nav-item mx-2">
                                        <Link 
                                            className={`nav-link ${location.pathname === '/homeServices' ? 'active' : ''}`}
                                            to="/homeServices" 
                                            style={{ color: "#0C0D0E", fontSize: "1.1rem" }}
                                        >
                                            Services
                                        </Link>
                                    </li>
                                    {(userRole === "admin" || isAdmin) && (
                                        <li className="nav-item mx-2">
                                            <Link 
                                                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                                to="/dashboard" 
                                                style={{ color: "#0C0D0E", fontSize: "1.1rem"}}
                                            >
                                                Dashboard
                                            </Link>
                                        </li>
                                    )}
                                </>
                            )}
                        </ul>

                        {/* Right Controls */}
                        <div className="d-flex align-items-center ms-lg-auto">
                            {/* Language Toggle */}
                            <button 
                                onClick={toggleLanguage} 
                                className="btn btn-success px-3 py-1 me-2" 
                                style={{ color: "#fff", fontSize: "0.9rem" }}
                            >
                                {language === "en" ? "العربية" : "English"}
                            </button>
        {Authorization !== null ? (
            <Link
            onClick={() => LogOut()}
            className="btn btn-link" 
            style={{ color: "#0C0D0E", fontSize: "1.1rem" }}
            >
            LogOut
            </Link>

        ) : (
        <>

            <Link
            aria-current="page"
            to="/register" 
            className="btn btn-link me-2" 
            style={{ color: "#0C0D0E", fontSize: "1.1rem"}}
            >
                Register
            </Link>

            <Link
            aria-current="page"
            to="/login" 
            className="btn btn-link me-2" 
            style={{ color: "#0C0D0E", fontSize: "1.1rem"}}
            >
                Login
            </Link>

        </>
        )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}