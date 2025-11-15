import React from 'react';
import "./footer.css";
import logo from "../../Assets/Img/logo.jpeg";

export default function Footer() {
  return (
    <div className="footer-bg">
      <footer>
        <div className="footer-container">
          {/* Logo & Description */}
          <div className="footer-section logo-desc">
            <div className="logo">
              <img src={logo} loading="lazy" alt="Logo" className="logoo" />
            </div>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus hendrerit suscipit egestas.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Service</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p><i className="fas fa-envelope"></i> esraaelbordeny@gmail.com</p>
            <p><i className="fas fa-map-marker-alt"></i> Cairo,Egypt</p>
            <p><i className="fas fa-phone"></i> +20 1150995796</p>
          </div>

          {/* Follow Us */}
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
