import React, { useMemo } from 'react';
import './TransportationSection.css';

const TransportationSection = ({ direction, beaches }) => {
  // Dữ liệu theo miền. Fallback dùng mặc định nếu không truyền direction
  const regionPresets = useMemo(
    () => ({
      north: {
        Flights: ['Ha Long Bay', 'Cat Ba Island', 'Do Son Beach'],
        Bus: ['Hai Phong City Tour', 'Ha Long – Van Don', 'Quang Ninh Coastal'],
        Car: ['Ha Long – Cat Ba Roadtrip', 'Hai Phong – Quang Ninh', 'Lang Co (via North)'],
        Cruise: ['Ha Long Overnight Cruise', 'Lan Ha Bay Day Cruise', 'Bai Tu Long Expedition']
      },
      south: {
        Flights: ['Phu Quoc Island', 'Con Dao Airport', 'Vung Tau (via SGN)'],
        Bus: ['Saigon – Vung Tau', 'Saigon – Mui Ne', 'Saigon – Phan Thiet'],
        Car: ['Mui Ne Sand Dunes', 'Vung Tau Coastline', 'Long Hai – Ho Tram'],
        Cruise: ['Phu Quoc Islands Hopping', 'Con Dao National Park', 'Can Gio – Can Gio Mangrove']
      },
      east: {
        Flights: ['Da Nang Airport', 'Nha Trang (Cam Ranh)', 'Quy Nhon (Phu Cat)'],
        Bus: ['Da Nang – Hoi An', 'Nha Trang – Cam Ranh', 'Quy Nhon – Eo Gio'],
        Car: ['Hai Van Pass Drive', 'Nha Trang Coastal Road', 'Phu Yen – Ganh Da Dia'],
        Cruise: ['Cham Islands Snorkeling', 'Nha Trang Bay Cruise', 'Ly Son Island Ferry']
      },
      west: {
        Flights: ['Da Lat (Lien Khuong)', 'Can Tho Airport', 'Rach Gia (to islands)'],
        Bus: ['Da Lat – Ta Nung Pass', 'Can Tho – Ha Tien', 'Rach Gia – Phu Quoc Pier'],
        Car: ['Mekong River Delta Drive', 'Ha Tien – Binh San', 'Dong Thap Lotus Road'],
        Cruise: ['Mekong Floating Markets', 'Ha Tien – Phu Quoc Ferry', 'Chau Doc – Tra Su Boat']
      }
    }),
    []
  );

  const defaults = {
    Flights: ['Phu Quoc Island', 'Nha Trang Beach', 'Da Nang Coast'],
    Bus: ['Ha Long Bay', 'Vung Tau Beach', 'Mui Ne Sand Dunes'],
    Car: ['Con Dao Islands', 'Phu Yen Coast', 'Quy Nhon Beach'],
    Cruise: ['Cat Ba Island', 'Phu Quoc Archipelago', 'Con Dao National Park']
  };

  const current = direction && regionPresets[direction] ? regionPresets[direction] : null;

  // Nếu truyền danh sách bãi biển thì dựng options bám sát danh sách này
  const beachNames = useMemo(() => {
    if (!Array.isArray(beaches) || beaches.length === 0) return [];
    const names = beaches
      .map((b) => (b && b.name ? String(b.name).trim() : ''))
      .filter(Boolean);
    // Loại bỏ trùng lặp, giữ thứ tự xuất hiện
    return Array.from(new Set(names));
  }, [beaches]);

  const pickNames = (offset) => {
    if (beachNames.length === 0) return [];
    const result = [];
    for (let i = 0; i < Math.min(3, beachNames.length); i += 1) {
      const idx = (offset + i) % beachNames.length;
      result.push(beachNames[idx]);
    }
    return result;
  };

  const optionsFromBeaches = beachNames.length
    ? {
        Flights: pickNames(0),
        Bus: pickNames(1),
        Car: pickNames(2),
        Cruise: pickNames(3)
      }
    : null;

  const transportationOptions = [
    {
      id: 1,
      type: 'Flights',
      icon: '✈️',
      title: 'Flights',
      description: 'Find the best flight deals to beach destinations',
      options: (optionsFromBeaches ? optionsFromBeaches.Flights : (current ? current.Flights : defaults.Flights))
    },
    {
      id: 2,
      type: 'Bus Tours',
      icon: '🚌',
      title: 'Bus Tours',
      description: 'Comfortable bus tours to coastal destinations',
      options: (optionsFromBeaches ? optionsFromBeaches.Bus : (current ? current.Bus : defaults.Bus))
    },
    {
      id: 3,
      type: 'Car Rentals',
      icon: '🚗',
      title: 'Car Rentals',
      description: 'Rent a car for the ultimate beach road trip experience',
      options: (optionsFromBeaches ? optionsFromBeaches.Car : (current ? current.Car : defaults.Car))
    },
    {
      id: 4,
      type: 'Cruises',
      icon: '🛳️',
      title: 'Cruises',
      description: 'Luxury cruise packages to multiple beach destinations',
      options: (optionsFromBeaches ? optionsFromBeaches.Cruise : (current ? current.Cruise : defaults.Cruise))
    }
  ];

  return (
    <section className="transportation-section">
      <div className="transportation-container">
        <div className="transportation-header">
          <h2>Transportation Options{direction ? ` — ${direction.charAt(0).toUpperCase() + direction.slice(1)} Region` : ''}</h2>
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
