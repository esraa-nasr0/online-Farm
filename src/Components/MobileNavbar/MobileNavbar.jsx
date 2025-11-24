import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { clearToken } from "../../utils/authToken";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import logo from "../../Assets/Img/WhatsAppLogo.jpeg";
import { PiNotebook } from "react-icons/pi";

export default function MobileNavbar({ toggleSidebar }) {
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
        clearToken();
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
               <PiNotebook 
        className="notebook-icon" 
        onClick={toggleSidebar} 
        style={{ cursor: "pointer", fontSize: "24px" }} 
      />
                <div className="navbar-logo">
                    {/* <img src={logo} alt="Logo" className="navbar-logo-img" /> */}
                    <span className="navbar-title" style={{color:"#21763e"}}>ONLINE FARM</span>
                </div>

             

          
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
          
                </div>
            )}
        </nav>
    );
}