import React from 'react';
import { Link } from 'react-router-dom';
import './SiteMap.css';

const SiteMap = () => {
  const siteStructure = {
    main: [
      { name: 'Home', path: '/', description: 'Homepage with comprehensive information about BeautyOfBeaches' },
      { name: 'About Us', path: '/about', description: 'Information about BeautyOfBeaches team and organization' },
      { name: 'Contact', path: '/contact', description: 'Contact information and message form' },
      { name: 'Feedback', path: '/feedback', description: 'Submit feedback and reviews about your experience' },
      { name: 'Frequently Asked Questions', path: '/queries', description: 'Find answers to commonly asked questions' }
    ],
    beaches: [
      { name: 'Top 50 Beaches', path: '/top50', description: 'List of the 50 most beautiful beaches in the world' },
      { name: 'Photo Gallery', path: '/gallery', description: 'Collection of beautiful beach photographs' }
    ],
    regions: [
      { name: 'North Region', path: '/regions/north', description: 'Explore beaches in Northern Vietnam' },
      { name: 'South Region', path: '/regions/south', description: 'Explore beaches in Southern Vietnam' },
      { name: 'East Region', path: '/regions/east', description: 'Explore beaches in Eastern Vietnam' },
      { name: 'West Region', path: '/regions/west', description: 'Explore beaches in Western Vietnam' }
    ],
    admin: [
      { name: 'Admin Login', path: '/admin/login', description: 'Administrator login portal' },
      { name: 'Admin Dashboard', path: '/admin/dashboard', description: 'Administrative control panel' },
      { name: 'Beach Management', path: '/admin/beaches', description: 'Manage beach information and content' },
      { name: 'Gallery Management', path: '/admin/galleries', description: 'Manage photo gallery and media' },
      { name: 'Feedback Management', path: '/admin/feedback', description: 'Manage user feedback and reviews' },
      { name: 'Statistics', path: '/admin/stats', description: 'View statistics and reports' }
    ]
  };

  return (
    <div className="sitemap-container">
      <div className="sitemap-content">
                 <div className="sitemap-header">
           <h1>Website Sitemap</h1>
           <p>Explore all pages and features of BeautyOfBeaches</p>
         </div>

        <div className="sitemap-grid">
          {/* Main Pages */}
          <div className="sitemap-section">
            <h2><i className="fas fa-home"></i> Main Pages</h2>
            <div className="sitemap-links">
              {siteStructure.main.map((item, index) => (
                <div key={index} className="sitemap-link-item">
                  <Link to={item.path} className="sitemap-link">
                    {item.name}
                  </Link>
                  <p className="sitemap-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Beaches */}
          <div className="sitemap-section">
            <h2><i className="fas fa-umbrella-beach"></i> Beaches</h2>
            <div className="sitemap-links">
              {siteStructure.beaches.map((item, index) => (
                <div key={index} className="sitemap-link-item">
                  <Link to={item.path} className="sitemap-link">
                    {item.name}
                  </Link>
                  <p className="sitemap-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Regions */}
          <div className="sitemap-section">
            <h2><i className="fas fa-map-marked-alt"></i> By Region</h2>
            <div className="sitemap-links">
              {siteStructure.regions.map((item, index) => (
                <div key={index} className="sitemap-link-item">
                  <Link to={item.path} className="sitemap-link">
                    {item.name}
                  </Link>
                  <p className="sitemap-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Admin */}
          <div className="sitemap-section">
            <h2><i className="fas fa-user-cog"></i> Administration</h2>
            <div className="sitemap-links">
              {siteStructure.admin.map((item, index) => (
                <div key={index} className="sitemap-link-item">
                  <Link to={item.path} className="sitemap-link">
                    {item.name}
                  </Link>
                  <p className="sitemap-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sitemap-footer">
          <div className="sitemap-stats">
                         <div className="stat-item">
               <span className="stat-number">15+</span>
               <span className="stat-label">Pages</span>
             </div>
             <div className="stat-item">
               <span className="stat-number">50+</span>
               <span className="stat-label">Beaches</span>
             </div>
             <div className="stat-item">
               <span className="stat-number">4</span>
               <span className="stat-label">Regions</span>
             </div>
             <div className="stat-item">
               <span className="stat-number">6</span>
               <span className="stat-label">Admin Features</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMap;
