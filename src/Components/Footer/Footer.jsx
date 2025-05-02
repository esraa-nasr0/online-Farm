import React from 'react'
import  "./footer.css"
import logo from "../../Assets/Img/logo.jpeg"
export default function Footer() {
  return (
    <div className=' footer-bg'>
      <footer >
    <div class="footer-container">
      {/* <!-- Logo & Description --> */}
      <div class="footer-section logo-desc">
        <div class="logo">
          <img src={logo} alt="Logo" class="logo-img" className=' logoo' />
        </div>
        <p class="description">
          Easily keep track of all your important Goat Farm records. Conveniently access and enter your Goat records from any internet-connected device, 24×7.
        </p>
      </div>

      {/* <!-- Useful Links --> */}
      <div class="footer-section useful-links">
        <h4 className=' fw-bold'>USEFUL LINKS</h4>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="Use">Help</a></li>
          <li><a href="Features">Features</a></li>
          <li><a href="Manageemployee">Manage employee</a></li>
        </ul>
      </div>

      {/* <!-- Contact Us --> */}
      <div class="footer-section contact-us">
        <h4 className='fw-bold'>CONTACT US</h4>
        <p><strong>Phone:</strong> +20 1150995796</p>
        <p><strong>Email:</strong> esraaelbordeny@gmail.com</p>
        <div class="social-icons">
          <a href="#"><i class="fab p-1 rounded icon-color fa-twitter"></i></a>
          <a href="#"><i class="fab  rounded p-1 icon-color fa-youtube"></i></a>
          <a href="#"><i class="fab rounded p-1 icon-color fa-facebook"></i></a>
          <a href="#" ><i class="fab  p-1 rounded icon-color fa-instagram"></i></a>
        </div>
      </div>

      
    </div>

  
  
    <div class="footer-bottom">
      &copy; 2025 Walbro Software Pvt. Ltd.
    </div>
  </footer>
    </div>
  )
}
