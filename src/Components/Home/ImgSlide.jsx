// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import goats from "../../Assets/Img/long-shot-herd-sheep-eating-grass-pasture.jpg";

// export default function ImgSlide() {
//   return (
//     <div className="hero-section d-flex align-items-center text-center text-lg-start">
//       <div className="overlay"></div>
//       <div className="container position-relative z-index-1">
//         <div className="row align-items-center">
//           <div className="col-lg-6 slide-in-left">
//             <h1 className="fw-bold display-3 text-white mb-3 shadow-text">
//               ONLINE <span className="text-accent">FARM</span>
//             </h1>
//             <p className="lead text-light shadow-text">
//               Manage your farm like never before! Track animal health, 
//               breeding, and productivity in a seamless, user-friendly way.
//             </p>
//             <a href="#explore" className="btn btn-glow btn-lg mt-3">
//               Get Started 🚀
//             </a>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .hero-section {
//           position: relative;
//           min-height: 100vh;
//           background: url(${goats}) center/cover no-repeat;
//           display: flex;
//           justify-content: center;
//         }
        
//         .overlay {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: rgba(0, 0, 0, 0.6);
//         }
        
//         .text-accent {
//           color: #f8b400;
//         }
        
//         .shadow-text {
//           text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
//         }
        
//         .btn-glow {
//           background: linear-gradient(45deg, #f8b400, #ff5733);
//           border: none;
//           color: white;
//           padding: 12px 30px;
//           border-radius: 50px;
//           font-weight: bold;
//           text-transform: uppercase;
//           transition: all 0.3s ease-in-out;
//           box-shadow: 0 0 15px rgba(248, 180, 0, 0.8);
//         }

//         .btn-glow:hover {
//           transform: scale(1.1);
//           box-shadow: 0 0 25px rgba(248, 180, 0, 1);
//         }

//         @media (max-width: 768px) {
//           .hero-section {
//             text-align: center;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import background from "../../Assets/Img/full-shot-man-living-countryside.jpg";

export default function ImgSlide() {
  return (
    <div className="hero-section d-flex align-items-center min-vh-100">
      <div className="overlay"></div>

      <div className="container position-relative text-center text-white">
        <h1 className="display-3 fw-bold fade-in shadow-text">
          ONLINE <span className="text-highlight">FARM</span>
        </h1>
        <p className="lead fade-in font-bold shadow-text">
          Effortlessly manage your farm with advanced tools.
        </p>
        <a href="#explore" className="btn btn-glow btn-lg mt-3 fade-in">
          Get Started 🚀
        </a>
      </div>

      {/* تحسينات الخلفية والتصميم */}
      <style jsx>{`
        .hero-section {
          background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(${background}) center/cover no-repeat;
          width: 100vw;
          height: 100vh;
          position: relative;
          text-align: center;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(3px);
        }

        .shadow-text {
          text-shadow: 3px 3px 12px rgba(0, 0, 0, 0.8);
        }

        .text-highlight {
          color: #ff8c00;
        }

        .btn-glow {
          background: linear-gradient(45deg, #ff8c00, #faa96c);
          border: none;
          color: white;
          padding: 14px 32px;
          border-radius: 50px;
          font-weight: bold;
          text-transform: uppercase;
          transition: all 0.4s ease-in-out;
          box-shadow: 0 0 15px #faa96c;
        }

        .btn-glow:hover {
          transform: scale(1.1);
          box-shadow: 0 0 40px rgba(255, 140, 0, 0.9);
          background: linear-gradient(45deg, #faa96c, #ff8c00);
        }

        .fade-in {
          animation: fadeIn 1.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            text-align: center;
          }
          .display-3 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
