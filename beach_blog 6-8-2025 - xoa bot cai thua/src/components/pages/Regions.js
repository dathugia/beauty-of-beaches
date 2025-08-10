import React from "react";
import { useParams } from "react-router-dom";
import TransportationSection from "../common/TransportationSection";
import "./Regions.css";

const Regions = () => {
  const { direction } = useParams();

  // Sample beach data for each direction
  const beachData = {
    east: {
      title: "East Region Beaches",
      beaches: [
        { name: "Bali Beach", country: "Indonesia", description: "Famous for its white sand and crystal clear water" },
        { name: "Phuket Beach", country: "Thailand", description: "Beautiful tropical paradise with stunning views" },
        { name: "Maldives Beaches", country: "Maldives", description: "Overwater bungalows and pristine beaches" }
      ]
    },
    north: {
      title: "North Region Beaches",
      beaches: [
        { name: "Norwegian Fjords", country: "Norway", description: "Dramatic coastal landscapes and northern lights" },
        { name: "Iceland Beaches", country: "Iceland", description: "Black sand beaches and geothermal wonders" },
        { name: "Alaska Coast", country: "USA", description: "Wilderness beaches with stunning mountain views" }
      ]
    },
    west: {
      title: "West Region Beaches",
      beaches: [
        { name: "California Coast", country: "USA", description: "Pacific coastline with golden beaches" },
        { name: "Hawaiian Islands", country: "USA", description: "Tropical paradise with volcanic landscapes" },
        { name: "Australian West Coast", country: "Australia", description: "Remote beaches with unique wildlife" }
      ]
    },
    south: {
      title: "South Region Beaches",
      beaches: [
        { name: "South African Coast", country: "South Africa", description: "Diverse beaches from Cape Town to Durban" },
        { name: "Brazilian Beaches", country: "Brazil", description: "Copacabana and Ipanema famous beaches" },
        { name: "Argentine Coast", country: "Argentina", description: "Patagonian beaches with dramatic scenery" }
      ]
    }
  };

  // If no specific direction, show all regions
  if (!direction) {
    return (
      <div className="regions-container">
        <div className="container mt-5 pt-5">
          <h1 className="text-center mb-5">Explore Beach Regions</h1>
          <div className="row">
            {Object.entries(beachData).map(([dir, data]) => (
              <div key={dir} className="col-md-6 col-lg-3 mb-4">
                <div className="region-card">
                  <h3>{data.title}</h3>
                  <p>Discover beautiful beaches in the {dir} region</p>
                  <a href={`/regions/${dir}`} className="btn btn-primary">Explore {dir.charAt(0).toUpperCase() + dir.slice(1)}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <TransportationSection />
      </div>
    );
  }

  // Show specific region
  const regionData = beachData[direction];
  if (!regionData) {
    return (
      <div className="container mt-5 pt-5">
        <h1>Region not found</h1>
        <p>The requested region does not exist.</p>
      </div>
    );
  }

  return (
    <div className="regions-container">
      <div className="container mt-5 pt-5">
        <h1 className="text-center mb-5">{regionData.title}</h1>
        <div className="row">
          {regionData.beaches.map((beach, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="beach-card">
                <div className="beach-image">
                  <img 
                    src={`https://source.unsplash.com/400x300/?beach,${beach.name}`} 
                    alt={beach.name}
                    className="img-fluid"
                  />
                </div>
                <div className="beach-info">
                  <h3>{beach.name}</h3>
                  <p className="country">{beach.country}</p>
                  <p className="description">{beach.description}</p>
                  <button className="btn btn-outline-primary">Learn More</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TransportationSection />
    </div>
  );
};

export default Regions;
