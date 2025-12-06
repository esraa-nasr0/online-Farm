import React from "react";
import gardenImg from "../../Assets/Img/pexels-pixabay-462119.jpg"; 
import "./imgslide.css";
import { Link, useNavigate } from "react-router-dom";

export default function HomeHero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("Authorization"); 
    if (token) {
      navigate("/userDashboard");
    } else {
      navigate("/login");
    }
  };

  
  return (
    <div className="hero-bg">
      <img src={gardenImg} className="background_img"  alt="Farm background"/>
      <div className="hero-overlay">
        <div className="hero-content-center">
          <h2 className="hero-title-main">ONLINE FARM</h2>
          <p className="hero-subtitle">
            Welcome to Online Farm, the all-in-one solution for efficient <br /> 
            goat and sheep farm management, designed to <br /> 
            simplify tracking of animal health, breeding, and productivity!
          </p>
          <div className="hero-btn-group">
            <button className="hero-main-btn" onClick={handleGetStarted}>Get Started</button>
            <button
  className="hero-outline-btn"
  onClick={() => {
    const lastSection = document.getElementById("last-section");
    if (lastSection) {
      lastSection.scrollIntoView({ behavior: "smooth" });
    }
  }}
>
  Learn More
</button>

          </div>
        </div>
      </div>
    </div>
  );
}


// import React from "react";
// import { useTranslation } from "react-i18next";
// import gardenImg from "../../Assets/Img/pexels-pixabay-462119.jpg"; 
// import "./imgslide.css";
// import { useNavigate } from "react-router-dom";

// export default function HomeHero() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const handleGetStarted = () => {
//     const token = localStorage.getItem("Authorization"); 
//     if (token) {
//       navigate("/userDashboard");
//     } else {
//       navigate("/login");
//     }
//   };

//   return (
//     <div className="hero-bg">
//       <img src={gardenImg} className="background_img" alt="Farm background"/>
//       <div className="hero-overlay">
//         <div className="hero-content-center">
//           <h2 className="hero-title-main">{t("title")}</h2>
//           <p className="hero-subtitle">{t("subtitle")}</p>
//           <div className="hero-btn-group">
//             <button className="hero-main-btn" onClick={handleGetStarted}>
//               {t("getStarted")}
//             </button>
//             <button
//               className="hero-outline-btn"
//               onClick={() => {
//                 const lastSection = document.getElementById("last-section");
//                 if (lastSection) {
//                   lastSection.scrollIntoView({ behavior: "smooth" });
//                 }
//               }}
//             >
//               {t("learnMore")}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
