import React from "react";  
import aboutImg from '../../Assets/Img/full-shot-man-living-countryside.jpg';  

export default function About() {  
    return (  
        <div className="container">  
            <div className="contact">  
                <h2>Welcome to Mazraa Online</h2>  
                <div className="about-content">  
                    <img 
                      className="aboutimg" 
                      src={aboutImg} 
                      alt="Farmer in countryside" 
                    />  
                    <div className="aboutdiv">  
                        <p>  
                            Mazraa Online is a comprehensive farm management solution designed for goat and sheep farmers.  
                            Our user-friendly web application helps you track and manage your livestock's health,  
                            breeding, and productivity for efficient and profitable farming.  
                        </p>  
                        <h5>Our Mission</h5>  
                        <p>  
                            We empower farmers with tools and data to optimize livestock management, streamline breeding,  
                            vaccinations, and weight tracking, and enhance animal welfare.  
                        </p>  
                        <h5>Why Choose Us?</h5>  
                        <p>  
                            Simplify your farm management and gain valuable insights with  
                            our intuitive platform, accessible from anywhere.  
                        </p>  
                        <h5>Join Us Today!</h5>  
                        <p>  
                            Sign up for Mazraa Online to transform your farm management,  
                            and follow us on [Social Media Links] for updates and resources.  
                        </p>  
                    </div>  
                </div>  
            </div>  
        </div>  
    );  
}