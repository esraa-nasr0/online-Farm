import React from "react";
import gardenImg from "../../Assets/Img/vecteezy_goat-animals-in-mountain-pastures-with-amazing-landscape-views_46816048.jpg";
import "./imgslide.css";
import { Link } from "react-router-dom";

export default function HomeHero() {
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
          <Link className='Link' to="/homeServices">
          <button
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
          </Link>
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