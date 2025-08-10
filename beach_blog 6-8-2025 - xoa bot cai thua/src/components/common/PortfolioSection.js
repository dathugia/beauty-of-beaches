import React, { useState, useEffect } from 'react';
import './PortfolioSection.css';

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState('*');
  const [filteredItems, setFilteredItems] = useState([]);

  const portfolioItems = [
    {
      id: 1,
      title: "Cala Goloritze",
      category: "south",
      image: "https://worlds50beaches.com/assets/images/world-2025/011.webp",
      link: "https://worlds50beaches.com/top-50-worlds-best-beaches/"
    },
    {
      id: 2,
      title: "Entalula Beach",
      category: "east",
      image: "https://worlds50beaches.com/assets/images/world-2025/021.webp",
      link: "https://worlds50beaches.com/top-50-worlds-best-beaches/"
    },
    {
      id: 3,
      title: "Bang Bao Beach",
      category: "east",
      image: "https://worlds50beaches.com/assets/images/world-2025/031.webp",
      link: "https://worlds50beaches.com/top-50-worlds-best-beaches/"
    },
    {
      id: 4,
      title: "Fteri Beach",
      category: "north",
      image: "https://worlds50beaches.com/assets/images/world-2025/041.webp",
      link: "https://worlds50beaches.com/top-50-worlds-best-beaches/"
    },
    {
      id: 5,
      title: "PK 9 Beach",
      category: "south",
      image: "https://worlds50beaches.com/assets/images/world-2025/051.webp",
      link: "https://worlds50beaches.com/top-50-worlds-best-beaches/"
    },
    {
      id: 6,
      title: "Canto de la Playa",
      category: "west",
      image: "https://worlds50beaches.com/assets/images/world-2025/061.webp",
      link: "https://worlds50beaches.com/top-50-worlds-best-beaches/"
    },
    {
      id: 7,
      title: "Anse Source d'Argent",
      category: "south",
      image: "https://worlds50beaches.com/assets/images/world-2025/071.webp",
      link: "https://worlds50beaches.com/top-50-worlds-best-beaches/"
    },
    {
      id: 8,
      title: "Nosy Iranja",
      category: "south",
      image: "https://worlds50beaches.com/assets/images/world-2025/081.webp",
      link: "https://worlds50beaches.com/top-50-worlds-best-beaches/"
    },
    {
      id: 9,
      title: "Ofu Beach",
      category: "west",
      image: "https://worlds50beaches.com/assets/images/world-2025/091.webp",
      link: "https://worlds50beaches.com/top-50-worlds-best-beaches/"
    },
    {
      id: 10,
      title: "Grace Bay",
      category: "north",
      image: "https://worlds50beaches.com/assets/images/world-2025/101.webp",
      link: "https://worlds50beaches.com/top-50-worlds-best-beaches/"
    }
  ];

  const filters = [
    { id: '*', label: 'Show All' },
    { id: '.project_cat-north', label: 'North' },
    { id: '.project_cat-south', label: 'South' },
    { id: '.project_cat-east', label: 'East' },
    { id: '.project_cat-west', label: 'West' }
  ];

  useEffect(() => {
    if (activeFilter === '*') {
      setFilteredItems(portfolioItems);
    } else {
      const category = activeFilter.replace('.project_cat-', '');
      const filtered = portfolioItems.filter(item => item.category === category);
      setFilteredItems(filtered);
    }
  }, [activeFilter]);

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
  };

  const getCategoryLabel = (category) => {
    const filter = filters.find(f => f.id.includes(category));
    return filter ? filter.label : category;
  };

  return (
    <section className="portfolio-section">
      <div className="container">
        <div className="portfolio-wrapper">
          <div className="portfolio-filters">
            <ul className="filters-list">
              {filters.map((filter) => (
                <li key={filter.id}>
                  <button
                    className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                    onClick={() => handleFilterClick(filter.id)}
                    data-filter={filter.id}
                  >
                    {filter.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="portfolio-grid">
            {filteredItems.map((item, index) => (
              <article 
                key={item.id} 
                className={`portfolio-item project_cat-${item.category}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="portfolio-item-holder">
                  <div className="portfolio-item-content">
                    <div className="entry-overlay-wrapper">
                      <div className="entry-thumbnail">
                        <a href={item.link} className="entry-thumbnail__link">
                          <div className="entry-image-ratio">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="portfolio-image"
                              loading="lazy"
                            />
                          </div>
                        </a>
                      </div>
                      <span className="entry-thumbnail__overlay"></span>
                      <div className="entry-details">
                        <div className="entry-details__inner">
                          <div className="portfolio-info">
                            <div className="entry-details-meta">
                              <div className="entry-meta-categories">
                                <ul>
                                  <li>
                                    <a href="#">{getCategoryLabel(item.category)}</a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <h4 className="entry-details-title">
                              <a href={item.link}>{item.title}</a>
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
