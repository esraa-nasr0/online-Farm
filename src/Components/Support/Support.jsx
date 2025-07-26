import supportImg from "../../Assets/Img/pexels-pixabay-462119.jpg";
import './Support.css';

function Support() {
  return (
    <div className="support-bg">
      <img src={supportImg} className="support_background_img" alt="Support background" />
      <div className="support-overlay">
        <div className="support-content-container">
          {/* Left Content */}
          <div className="support-content-left">
            <h2 className="support-title-main">You Have Questions,<br />We Have Answers </h2>
            <p className="support-subtitle">
              Support, your go-to resource for all your goat and sheep farm management needs.
              Here, you can find answers to common questions, access helpful resources, and get in touch with our support team.
            </p>

            <div className="support-contact-info">
              <p><strong>Email:</strong> esraaelbordeny@gmail.com</p>
              <p><strong>Phone:</strong> +20 1150995796</p>
            </div>
          </div>

          {/* Right Form */}
          <div className="support-form-container">
            <h3>Tell Us What You Need</h3>
            <form className="support-form">
              <div className="support-input-group">
                <input type="text" placeholder="Full Name" />
              </div>
              <div className="support-input-group">
                <input type="text" placeholder="Country" />
                <input type="text" placeholder="Phone Number" />
              </div>
              <input type="email" placeholder="Email Address" />
              
              <textarea placeholder="Message"></textarea>
              <div className="checkbox-group">
                <input type="checkbox" id="subscribe" />
                <label htmlFor="subscribe">I’d like to receive exclusive offers and updates</label>
              </div>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
