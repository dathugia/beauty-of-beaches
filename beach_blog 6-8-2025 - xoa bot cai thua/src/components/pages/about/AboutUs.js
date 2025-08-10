import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-content">
        {/* Header Section */}
        <div className="about-header">
          <h1 className="main-title">ABOUT US</h1>
          <h2 className="subtitle">INSPIRING EPIC BEACH DAYS FOR OVER 7 YEARS</h2>
        </div>

        {/* Story Section */}
        <div className="story-section">
          <h3>OUR STORY</h3>
          <div className="story-content">
            <p>
              The idea for The World's 50 Best Beaches was sparked by our genuine passion for the beach. 
              As avid beach enthusiasts and travellers ourselves, we've had the privilege of experiencing 
              countless beaches across the globe. Yet, amidst the vast array of stunning shorelines, we 
              realized that discovering and experiencing truly exceptional beaches is far more difficult than it seems.
            </p>
            <p>
              Driven by our desire to share our love for the beach and to provide a valuable resource for 
              beach lovers worldwide, we embarked on a mission to curate a comprehensive and inspiring list 
              of the world's best beaches. Drawing upon our own experiences and insights, as well as the 
              collective expertise of countless travel professionals, we wanted to create a definitive, 
              authoritative list that would inspire and inform beachgoers around the globe.
            </p>
            <p>
              As beach lovers ourselves, we understand the amazing impact that a truly exceptional beach 
              can have on one's mood and sense of well-being. It is our hope that through The World's 50 
              Best Beaches, we can inspire others to embark on their own beach adventures, to explore the 
              wonders of nature, and to experience the joy that can be found along the world's most stunning shorelines.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mission-section">
          <h3>OUR MISSION</h3>
          <p className="mission-text">
            WE WANT TO TELL THE WORLD THE STORY OF NATURE'S MOST STUNNING SETTING, THE BEACH.
          </p>
        </div>

        {/* Selection Process Section */}
        <div className="selection-section">
          <h3>OUR SELECTION PROCESS</h3>
          <div className="selection-content">
            <p>
              Each year, we reach out to thousands of the world's most experienced travel professionals, 
              and ask them to vote for what they think is the best beach on earth. Voters are not given 
              any specific criteria as to what makes a beach the best, but they are asked to describe why 
              they think it is the best.
            </p>
            <p>
              As many of the world's best beaches are yet to be discovered, our final list is not based 
              purely on votes cast. The number of votes a beach receives is a contributing factor to its 
              appearance on our list as well as its ranking.
            </p>
            
            <div className="criteria-section">
              <h4>Our Selection Criteria:</h4>
              <div className="criteria-grid">
                <div className="criteria-column">
                  <ul className="criteria-list">
                    <li><strong>Unique:</strong> The surrounding landscape makes it very unique</li>
                    <li><strong>Wildlife:</strong> You are likely to encounter incredible wildlife</li>
                    <li><strong>Untouched:</strong> Far off the beaten path and in pristine state</li>
                    <li><strong>Soundtrack of Nature:</strong> Only ocean and nature sounds</li>
                  </ul>
                </div>
                <div className="criteria-column">
                  <ul className="criteria-list">
                    <li><strong>Easy to Enter:</strong> Calm waters with sandy bottom</li>
                    <li><strong>Often Calm Water:</strong> Usually very calm ocean</li>
                    <li><strong>Not Too Crowded:</strong> Never too crowded, very peaceful</li>
                    <li><strong>Frequently Idyllic:</strong> Higher odds of perfect beach days</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <h3>Meet Our Team</h3>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">
                <div className="avatar-placeholder"></div>
              </div>
              <h4 className="member-name">Sarah Johnson</h4>
              <p className="member-role">Founder & CEO</p>
              <p className="member-description">
                Travel enthusiast with 10+ years of experience exploring coastal destinations worldwide.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar">
                <div className="avatar-placeholder"></div>
              </div>
              <h4 className="member-name">Mike Chen</h4>
              <p className="member-role">Lead Photographer</p>
              <p className="member-description">
                Award-winning photographer specializing in landscape and travel photography.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar">
                <div className="avatar-placeholder"></div>
              </div>
              <h4 className="member-name">Emma Rodriguez</h4>
              <p className="member-role">Content Director</p>
              <p className="member-description">
                Expert travel writer and cultural researcher with passion for coastal destinations.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar">
                <div className="avatar-placeholder"></div>
              </div>
              <h4 className="member-name">David Kim</h4>
              <p className="member-role">Technology Lead</p>
              <p className="member-description">
                Full-stack developer and tech enthusiast who builds amazing digital experiences for beach lovers.
              </p>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="download-section">
          <h4>Download Complete Information</h4>
          <div className="download-buttons">
            <button className="btn btn-primary" onClick={() => downloadFile('pdf')}>
              📄 Download PDF
            </button>
            <button className="btn btn-success" onClick={() => downloadFile('doc')}>
              📝 Download DOC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Function to handle file download
const downloadFile = (type) => {
  // This would typically connect to your backend API
  // For now, we'll show an alert
  if (type === 'pdf') {
    alert('PDF download feature will be implemented with backend integration');
  } else {
    alert('DOC download feature will be implemented with backend integration');
  }
};

export default AboutUs;
