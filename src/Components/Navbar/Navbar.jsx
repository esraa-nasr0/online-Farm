import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar({ toggleSidebar }) {
    let { Authorization, setAuthorization } = useContext(UserContext);
    let navigate = useNavigate();
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);

    const userRole = Authorization ? jwtDecode(Authorization).role : null;
    const isAdmin = localStorage.getItem("isAdmin") === "true";

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
        <nav className="navbar p-3 mb-4 fixed-top navbar-dark navbar-expand-lg" style={{ backgroundColor: "#3f5c40" }}>
            <div className="container-fluid d-flex align-items-center">
                
                
                <button className="btn p-2 me-2" style={{ color: "#E9E6E2", backgroundColor: "transparent" }} onClick={toggleSidebar}>
                    <FaBars />
                </button>

                <Link className="navbar-brand" to="#" style={{ color: "#E9E6E2" }}>
                    Online Farm
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {Authorization !== null && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/" style={{ color: "#E9E6E2" }}>Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/homeServices" style={{ color: "#E9E6E2" }}>Home Services</Link>
                                </li>
                                {(userRole === "admin" || isAdmin) && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/dashboard" style={{ color: "#E9E6E2" }}>Dashboard</Link>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>

                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <button className="btn btn-link nav-link" onClick={toggleLanguage} style={{ color: "#E9E6E2" }}>
                                {language === "en" ? "العربية" : "English"}
                            </button>
                        </li>
                        {Authorization !== null ? (
                            <li className="nav-item">
                                <Link onClick={LogOut} className="nav-link active" style={{ color: "#E9E6E2" }}>
                                    LogOut
                                </Link>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link active" to="Register" style={{ color: "#E9E6E2" }}>
                                        Register
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" to="Login" style={{ color: "#E9E6E2" }}>
                                        Login
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
