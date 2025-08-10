import React from 'react';
import './TransportationSection.css';

const TransportationSection = () => {
  const transportationOptions = [
    {
      id: 1,
      type: 'Flights',
      icon: '✈️',
      title: 'Flights',
      description: 'Find the best flight deals to beach destinations worldwide',
      options: [
        'Phu Quoc Island',
        'Nha Trang Beach', 
        'Da Nang Coast'
      ]
    },
    {
      id: 2,
      type: 'Bus Tours',
      icon: '🚌',
      title: 'Bus Tours',
      description: 'Comfortable bus tours to coastal destinations',
      options: [
        'Ha Long Bay',
        'Vung Tau Beach',
        'Mui Ne Sand Dunes'
      ]
    },
    {
      id: 3,
      type: 'Car Rentals',
      icon: '🚗',
      title: 'Car Rentals',
      description: 'Rent a car for the ultimate beach road trip experience',
      options: [
        'Con Dao Islands',
        'Phu Yen Coast',
        'Quy Nhon Beach'
      ]
    },
    {
      id: 4,
      type: 'Cruises',
      icon: '🛳️',
      title: 'Cruises',
      description: 'Luxury cruise packages to multiple beach destinations',
      options: [
        'Cat Ba Island',
        'Phu Quoc Archipelago',
        'Con Dao National Park'
      ]
    }
  ];

  return (
    <section className="transportation-section">
      <div className="transportation-container">
        <div className="transportation-header">
          <h2>Transportation Options</h2>
          <p>Choose your preferred way to explore beautiful beach destinations</p>
        </div>

        <div className="transportation-grid">
          {transportationOptions.map((option) => (
            <div key={option.id} className="transportation-card">
              <div className="card-icon">
                <span className="icon">{option.icon}</span>
              </div>
              
              <h3 className="card-title">{option.title}</h3>
              <p className="card-description">{option.description}</p>
              
              <div className="card-options">
                {option.options.map((item, index) => (
                  <div key={index} className="option-item">
                    <span className="option-name">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransportationSection;
