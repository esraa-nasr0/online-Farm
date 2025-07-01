import React from "react";
import gardenImg from "../../Assets/Img/pexels-helenalopes-841303.jpg"; 
import "./imgslide.css";
import { Link, useNavigate } from "react-router-dom";

export default function HomeHero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("Authorization"); 
    if (token) {
      navigate("/homeServices");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="hero-bg">
      <img src={gardenImg} className="background_img" alt="Farm background"/>
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
            <Link  className="hero-link">
            <button className="hero-outline-btn">Learn More</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
