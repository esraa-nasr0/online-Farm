import React from "react";
import gardenImg from "../../Assets/Img/full-shot-man-living-countryside.jpg";

export default function HomeHero() {
  return (
    <div style={{ 
      backgroundColor: "#f6f1ea", 
      minHeight: "100vh",
      display: "flex",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Text Content */}
      
      <div style={{ 
        flex: 1,
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        zIndex: 2,
        maxWidth: "50%"
      }}>
        <h1 style={{ 
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#0C0D0E",
          lineHeight: "1.3",
          marginBottom: "1.5rem"
        }}>
          If you want to be happy for a lifetime, plant a garden
        </h1>
        
        <p style={{ 
          fontSize: "1rem",
          color: "#555",
          marginBottom: "2rem",
          lineHeight: "1.6",
          maxWidth: "500px"
        }}>
          It is a long established fact that a reader will be distracted by the readable content.
        </p>
        
        <button style={{
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          padding: "0.75rem 2rem",
          borderRadius: "4px",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "1rem",
          width: "fit-content"
        }}>
          Shop now
        </button>
      </div>

      {/* Background Image */}
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "50%",
        backgroundImage: `url(${gardenImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 1
      }} />
    </div>
  );
}