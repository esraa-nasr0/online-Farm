import React from 'react';
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";


function ContactUs() {
    return <>
        <div className='contact'>
            <h2>Contact Us</h2>
            <p>Reach out to us for any inquiries or feedback.</p>
            <div className="row2">
                <div className='col'>
                    <p><FaPhoneAlt />  +201150995796</p>
                    <p><MdEmail /> esraaelbordeny@gmail.com</p>
                </div>
            </div>
        </div>
    </>
}

export default ContactUs
