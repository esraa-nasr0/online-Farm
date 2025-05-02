import React, { useContext } from "react";
import gardenImg from "../../Assets/Img/vecteezy_goat-animals-in-mountain-pastures-with-amazing-landscape-views_46816048.jpg";
import "./imgslide.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

export default function HomeHero() {
  const { Authorization } = useContext(UserContext);
  const navigate = useNavigate();

  const handleStartNow = () => {
    if (Authorization) {
      navigate("/homeServices");
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f6f1ea",
        minHeight: "100vh",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Text Content */}
      <div
        className="text-content"
        style={{
          flex: 1,
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 2,
          maxWidth: "50%",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            color: "#0C0D0E",
            lineHeight: "1.3",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          ONLINE FARM
        </h1>

        <p
          style={{
            fontSize: "1rem",
            color: "#555",
            lineHeight: "1.3",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Welcome to Online Farm, the all-in-one solution for efficient goat
          and sheep farm management, designed to simplify tracking of animal
          health, breeding, and productivity!
        </p>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleStartNow}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "0.75rem 2rem",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
              width: "fit-content",
            }}
          >
            START NOW
          </button>
        </div>
      </div>

      {/* Background Image */}
      <div
        className="hero-image"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "50%",
          backgroundImage: `url(${gardenImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
        }}
      />
    </div>
  );
}
