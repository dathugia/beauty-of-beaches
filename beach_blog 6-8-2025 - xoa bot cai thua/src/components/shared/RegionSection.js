import React from 'react';
import { Link } from 'react-router-dom';
import './RegionSection.css';

const RegionSection = () => {
  const regions = [
    {
      id: 'north',
      name: 'North',
      description: 'Explore the wild beauty of the Northern beaches',
      icon: '🏔️',
      color: '#4A90E2',
      link: '/regions/north'
    },
    {
      id: 'south',
      name: 'South',
      description: 'Enjoy the tropical atmosphere of the Southern beaches',
      icon: '🌴',
      color: '#7ED321',
      link: '/regions/south'
    },
    {
      id: 'east',
      name: 'East',
      description: 'Witness beautiful sunrises from the Eastern beaches',
      icon: '🌅',
      color: '#F5A623',
      link: '/regions/east'
    },
    {
      id: 'west',
      name: 'West',
      description: 'Watch romantic sunsets at the Western beaches',
      icon: '🌇',
      color: '#9013FE',
      link: '/regions/west'
    }
  ];

  return (
    <section className="region-section">
      <div className="region-container">
        <h2 className="region-title">
          Explore by region
        </h2>
        <p className="region-subtitle">
          Choose the region you want to explore to learn about beautiful beaches
        </p>
        
        <div className="region-grid">
          {regions.map((region) => (
            <Link 
              key={region.id} 
              to={region.link} 
              className="region-card"
              style={{ background: region.color }}
            >
              <div className="region-header">
                <div className="region-icon">{region.icon}</div>
                <h3 className="region-name">{region.name}</h3>
              </div>
              <p className="region-description">{region.description}</p>
              <div className="region-link">
                <span className="location-icon">📍</span>
                <span>View details</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegionSection;
