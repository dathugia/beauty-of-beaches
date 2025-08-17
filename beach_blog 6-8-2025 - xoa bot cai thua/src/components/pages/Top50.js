import React from "react";
import Beaches from "../shared/Beaches";
import "./Top50.css"; // Import CSS file for styling

const Top50 = () => {
  return (
    <div className="top50-page">
      {/* <div className="container"> */}
        <div className="text-center">
          <h1 className="display-4 fw-bold mb-4">THE BEST BEACHES IN THE WORLD, 2025</h1>
          <p className="lead text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Welcome to the 2025 list of The World's Best Beaches. Our 2025 list is a culmination of countless days spent by our judges, Beach Ambassadors and World's Beaches team exploring beaches all over the world. We hope this list provides the inspiration you need to plan your next beach vacation.
          </p>
        {/* </div> */}
      </div>
      <Beaches />
    </div>
  );
};

export default Top50;
