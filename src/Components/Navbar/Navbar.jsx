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
    <>
      <nav
  className="navbar p-3 mb-2 fixed-top navbar-dark navbar-expand-lg"
  style={{ backgroundColor: "#F3F3F3" }}
>
  <div className="container-fluid">
       <button className="btn p-2 me-2" style={{ color: "#F3F3F3", backgroundColor: "#9cbd81" }} onClick={toggleSidebar}>
                    <FaBars />
                </button>
    <Link className="navbar-brand" to="#" style={{ color: "#0C0D0E" }}>
      Online Farm
    </Link>

     
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>


    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        {Authorization !== null ? (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/" style={{ color: "#0C0D0E" }}>
                Home
              </Link>
            </li>
            
            <li className="nav-item">
                <Link className="nav-link" to="/homeServices" style={{ color: "#0C0D0E" }}>
                    Home Services

                </Link>


            {/* عرض Dashboard فقط للأدمن الأصلي حتى لو سجل كيوزر */}
            {(userRole === "admin" || isAdmin) && (
                <li className="nav-item">
                    <Link className="nav-link" to="/dashboard" style={{ color: "#0C0D0E" }}>
                        Dashboard
                    </Link>
                </li>
            )}
          </>
        ) : (
          ""
        )}
      </ul>
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {/* زر تبديل اللغة */}
              <li className="nav-item">
                <button className="btn btn-lg btn-link nav-link" onClick={toggleLanguage} style={{backgroundColor: "#9cbd81", color: "#ffffff" }}>
                  {language === "en" ? "العربية" : "English"}
                </button>
              </li>
        {Authorization !== null ? (
          <li className="nav-item">
            <Link
              onClick={() => LogOut()}
              className="nav-link active"
              style={{ color: "#0C0D0E" }}
            >
              LogOut
            </Link>
          </li>
        ) : (
          <>
            <li className="nav-item">
              <Link
                className="nav-link active"
                aria-current="page"
                to="Register"
                style={{ color: "#0C0D0E" }}
              >
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link active"
                aria-current="page"
                to="Login"
                style={{ color: "#0C0D0E" }}
              >
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
