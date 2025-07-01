import React from 'react';
import './LastSection.css';
import {
  FaBarcode, FaBalanceScale, FaSyringe, FaBaby,
  FaUsersCog, FaPrint, FaShieldAlt, FaStream
} from 'react-icons/fa';

const features = [
  {
    title: 'Tag ID',
    description: 'Track each animal record using Tag ID.',
    icon: <FaBarcode />,
  },
  {
    title: 'Weight Measurement',
    description: 'Record animal weight and monitor progress.',
    icon: <FaBalanceScale />,
  },
  {
    title: 'Vaccination',
    description: 'Manage vaccinations, reminders, and expenses.',
    icon: <FaSyringe />,
  },
  {
    title: 'Breeding',
    description: 'Track breeding cycles and offspring.',
    icon: <FaBaby />,
  },
  {
    title: 'Treatment',
    description: 'Manage employee roles and treatment tasks.',
    icon: <FaUsersCog />,
  },
  {
    title: 'Feeding',
    description: 'Track feeding schedules and sales tags.',
    icon: <FaPrint />,
  },
  {
    title: 'Animal Cost',
    description: 'Manage insurance and cost records.',
    icon: <FaShieldAlt />,
  },
  {
    title: 'Excluded',
    description: 'Track animal status: Dead, Sold, Ready to sell.',
    icon: <FaStream />,
  },
];

const Features = () => {
  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-heading">
          Our animal management <span>features</span>
        </h2>
        <p className="section-subtext">
          All-in-one solution for handling animal data from tagging to treatment.
        </p>
        <div className="cards-grid">
          {features.map((feature, idx) => (
            <div
              className={`feature-card ${idx === 0 ? 'active' : ''}`}
              key={idx}
            >
              <div className="icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
