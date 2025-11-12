import React from 'react';
import section from "../../Assets/Img/WhatsApp Image 2025-04-19 at 5.56.03 PM.jpeg";
import "./Section.css"; // هنربطه بالـ CSS

export default function Section() {
  return (
    <div className="section-container">
      <div className="section-content">
        <div className="text-area">
          <h1>Manage employee,<span>workers, team</span>  and network in farming.</h1>
          <ul>
            <li>Allow your employee, workers, team to perform restricted functions as per their role.</li>
            <li>Set reminders for team on upcoming task including vaccination, feed schedule, weighing schedule etc.</li>
            <li>Record expenses including capturing receipts, payments etc.</li>
          </ul>
        </div>

        <div className="image-area">
          <img src={section} loading="lazy" alt="employee preview" />
        </div>
      </div>
    </div>
  );
}
