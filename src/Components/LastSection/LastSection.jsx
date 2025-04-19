import React from 'react';
import './LastSection.css';
import {
  FaBarcode, FaBalanceScale, FaSyringe, FaBaby,
  FaUsersCog, FaPrint, FaShieldAlt, FaStream
} from 'react-icons/fa';

const features = [
  {
    title: 'Tag ID',
    description: [
      'Track each animal record using Tag ID.',
      'Tag ID can be scanned from mobile camera.'
    ],
    icon: <FaBarcode />
  },
  {
    title: 'Weight Measurement',
    description: [
      'Allow to record weight of animal at each stage.',
      'Analyze progress of weight as per dates and remark.'
    ],
    icon: <FaBalanceScale />
  },
  {
    title: 'Vaccination',
    description: [
      'Maintain vaccination treatment detail for each animal.',
      'Setup reminder, capture expense and analyze report on vaccination.'
    ],
    icon: <FaSyringe />
  },
  {
    title: 'Breeding',
    description: [
      'Maintain breeding detail and kids born on each breeding cycle.',
      'Allows to link mother’s Tag ID with Kids Tag ID.'
    ],
    icon: <FaBaby />
  },
  {
    title: 'Treatment',
    description: [
      'Manage employee work as per their role.',
      'Maintain employee records including their functions.'
    ],
    icon: <FaUsersCog />
  },
  {
    title: 'Feeding',
    description: [
      'Print Sales Tag that contain information of animal including breed, weight, age and price (optional).',
      'It allows to print blank sales tag with Tag ID.'
    ],
    icon: <FaPrint />
  },
  {
    title: 'Animal Cost',
    description: [
      'Maintain Insurance detail of animal including their stage.'
    ],
    icon: <FaShieldAlt />
  },
  {
    title: 'Excluted',
    description: [
      'Maintain various status of animal as per their stage including “Dead, Sold & Ready to sell”.',
      'Analyze the reports based on various status.'
    ],
    icon: <FaStream />
  }
];

const Features = () => {
  return (
    <div className="features-container container mx-auto">
      <h2 className="features-title">Features</h2>
      <div className="features-grid">
        {features.map((feature, idx) => (
          <div className="feature-card" key={idx}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <ul>
              {feature.description.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
