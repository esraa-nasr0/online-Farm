import React from 'react';
import { GiGoat } from "react-icons/gi";
import { Link } from 'react-router-dom';

function ImgSlide() {
  return (
    <div className="div">
      <section className="container  secdiv">
      <GiGoat className='gigoat text-center'/>
        <div className='float'>
        <div className='position-relative  text-white'>
          <h2 className="display-3 fw-bold fade-in shadow-text">
          Welcome to<br />
            <span>ONLINE FARM</span>
          </h2>
          <h3  className="lead fade-in font-bold shadow-text">
          Effortlessly manage your farm with advanced tools.</h3>
          <Link className='Link' to="/homeServices">
          <button href="#projects" className="btn btn-glow btn-lg mt-3 fade-in">
            Get Started 🚀
          </button>
          </Link>
        </div>
        </div>
      </section>
    </div>
  );
}

export default ImgSlide;
