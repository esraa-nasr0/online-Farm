import React from "react";
import goats from "../../Assets/Img/long-shot-herd-sheep-eating-grass-pasture.jpg";

export default function ImgSlide() {
return (
    <div style={{ background: "#ddd6c2", height: "100vh" }}>
    <div
        style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
          padding: "0 2rem", // Add padding to prevent elements from touching edges
        }}
        className="container"
    >
        {/* Section for the title */}
        <div style={{ flex: 1, textAlign: "center" }}>
        <h1
            className="font-bold"
            style={{
            fontSize: "3rem",
            color: "#5a3e2b",
            marginBottom: "1rem",
            }}
        >
            ONLINE FARM
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#555" }}>
        Welcome to Online Farm, the all-in-one 
        solution for efficient goat and sheep farm management,
        designed to simplify tracking of animal health, breeding, and productivity!
        </p>
        </div>

        {/* Section for the image */}
        <div style={{ flex: 1, textAlign: "center" }}>
        <img
            src={goats}
            alt="Goats"
            style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
        />
        </div>
    </div>
    </div>
);
}
