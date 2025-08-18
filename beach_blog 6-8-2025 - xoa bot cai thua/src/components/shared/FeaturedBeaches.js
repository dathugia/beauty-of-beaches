import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedBeaches.css';

const FeaturedBeaches = () => {
  const featuredBeaches = [
    {
      id: 1,
      name: "Fteri Beach",
      country: "Greece",
      region: "North",
      image: "https://worlds50beaches.com/assets/images/world-2025/041.webp",
      link: "/beaches/fteri-beach"
    },
    {
      id: 2,
      name: "Cala Goloritze",
      country: "Italy",
      region: "South",
      image: "https://worlds50beaches.com/assets/images/world-2025/011.webp",
      link: "/beaches/cala-goloritze"
    },
    {
      id: 3,
      name: "Entalula Beach",
      country: "Philippines",
      region: "East",
      image: "https://worlds50beaches.com/assets/images/world-2025/021.webp",
      link: "/beaches/entalula-beach"
    },
    {
      id: 4,
      name: "Canto de la Playa",
      country: "Spain",
      region: "West",
      image: "https://worlds50beaches.com/assets/images/world-2025/061.webp",
      link: "/beaches/canto-de-la-playa"
    }
  ];

  return (
    <section className="featured-beaches">
      <div className="featured-beaches__container">
        <div className="featured-beaches__header">
          <div className="featured-beaches__title-section">
            <h2 className="featured-beaches__title">
              Featured beaches
            </h2>
            <p className="featured-beaches__subtitle">
              Discover the world's most beautiful beaches from all regions
            </p>
          </div>
        </div>
        
        <div className="featured-beaches__grid">
          {featuredBeaches.map((beach) => (
            <div key={beach.id} className="beach-card">
              <div className="beach-card__image-container">
                <img 
                  className="beach-card__image" 
                  src={beach.image} 
                  alt={beach.name}
                />
              </div>
              <div className="beach-card__content">
                <div className="beach-card__info">
                  <h3 className="beach-card__name">
                    Top beaches in the {beach.region}
                  </h3>
                  {/* <p className="beach-card__country">
                    {beach.country} • {beach.region}
                  </p> */}
                </div>
                <Link to={`/regions/${beach.region.toLowerCase()}`} className="beach-card__details">
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBeaches;
