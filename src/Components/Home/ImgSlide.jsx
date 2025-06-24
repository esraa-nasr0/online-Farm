import React from "react";
import gardenImg from "../../Assets/Img/vecteezy_goat-animals-in-mountain-pastures-with-amazing-landscape-views_46816048.jpg"; 
import "./imgslide.css";
import { Link } from "react-router-dom";

export default function HomeHero() {
  return (
    <div className="hero-wrapper">
      <div className="hero-card">

     
          <div className=" text-center">
     <h3 className="boold">ONLINE FARM</h3>
        <p className="mt-4 mb-4">
          Welcome to Online Farm, the all-in-one solution for efficient <br /> goat and sheep farm management, designed to <br /> simplify tracking of animal health, breeding, and productivity!

        </p>


        <div className=" d-flex align-items-center gap-5 justify-content-center">
         <Link className='Link' to="/login"> <button className="log-btn">Login</button></Link>
         <Link className='Link' to="/register"> <button className="reg-btn">Register</button></Link>
        </div>
          </div>
     
         <div className="hero-image">
          <img src={gardenImg} alt="cow" />
        </div>
        </div>
   
 
    </div>
  );
}


        {/* <div className="hero-content">
          <h2 className="hero-location">🌤ONLINE FARM
</h2>
          <h1 className="hero-title">
            Fresh Pasture Raised <span className="highlight">Raw</span> Dairy
          </h1>
          <div className="hero-buttons">
            <button className="btn-primary">Shop Now</button>
            <button className="btn-secondary">Learn More</button>
          </div>
          <div className="hero-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
        <div className="hero-image">
          <img src={gardenImg} alt="cow" />
        </div> */}