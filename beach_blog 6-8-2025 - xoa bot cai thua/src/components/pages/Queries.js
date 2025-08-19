import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Queries.css';

const Queries = () => {
  // State để quản lý việc mở/đóng các câu hỏi
  const [openQuestions, setOpenQuestions] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Dữ liệu FAQ được tổ chức theo categories
  const faqData = {
    'General Information': [
      {
        question: 'What is BeautyOfBeaches?',
        answer: 'BeautyOfBeaches is a comprehensive platform dedicated to showcasing the world\'s most beautiful beaches. We provide detailed information, stunning photography, travel tips, and planning resources to help you discover and visit amazing coastal destinations around the globe.'
      },
      {
        question: 'How often is the content updated?',
        answer: 'Our content is regularly updated with new beach destinations, fresh photography, and the latest travel information. We typically update our database monthly with new locations and seasonal information to ensure you have the most current and accurate details.'
      },
      {
        question: 'Is the website free to use?',
        answer: 'Yes, BeautyOfBeaches is completely free to use! All our beach information, photo galleries, travel tips, and planning resources are available at no cost. We believe everyone should have access to discover the world\'s most beautiful beaches.'
      }
    ],
    'Travel Planning': [
      {
        question: 'How do I plan a trip to these beaches?',
        answer: 'Planning a beach trip is easy with our platform! Start by browsing our beach destinations, read detailed information about each location, check the best times to visit, and use our travel tips. You can also download content for offline reference and contact our support team for personalized assistance.'
      },
      {
        question: 'What\'s the best time to visit different beaches?',
        answer: 'The best time to visit varies by location. Tropical beaches are typically best during dry seasons, while Mediterranean beaches are perfect in summer. We provide seasonal information for each destination, including weather patterns, crowd levels, and special events to help you choose the ideal time for your visit.'
      },
      {
        question: 'Do you provide accommodation recommendations?',
        answer: 'While we focus primarily on beach information and travel planning, we do provide general accommodation tips and recommendations for each destination. For specific bookings, we recommend using trusted travel platforms or contacting local tourism offices for the most current options.'
      }
    ],
    'Safety & Guidelines': [
      {
        question: 'Are these beaches safe for swimming?',
        answer: 'We provide safety information for each beach, including water conditions, potential hazards, and local safety guidelines. Always check current conditions before swimming, follow local lifeguard instructions, and be aware of weather conditions and tide schedules.'
      },
      {
        question: 'What should I pack for a beach trip?',
        answer: 'Essential items include sunscreen (reef-safe), water, snacks, towels, beach umbrella or shade, first aid kit, and appropriate swimwear. Don\'t forget to pack eco-friendly products to minimize environmental impact and respect local marine life.'
      },
      {
        question: 'How do I respect local environments and cultures?',
        answer: 'Respect local customs by dressing appropriately, learning basic local phrases, and following cultural guidelines. Protect the environment by using reef-safe sunscreen, avoiding single-use plastics, staying on designated paths, and never touching or removing marine life or coral.'
      }
    ],
    'Technical Support': [
      {
        question: 'How do I download content as PDF or DOC?',
        answer: 'You can download beach information and travel guides in PDF or DOC format using our download feature. Simply navigate to any beach page, look for the download button, and select your preferred format. Downloads are free and include comprehensive information about the destination.'
      },
      {
        question: 'Why isn\'t the location ticker working?',
        answer: 'If the location ticker isn\'t working, try refreshing the page or clearing your browser cache. Ensure you have a stable internet connection and that JavaScript is enabled. If the issue persists, please contact our technical support team for assistance.'
      },
      {
        question: 'How do I report a technical issue?',
        answer: 'To report technical issues, use our "Submit Feedback" form or contact our support team directly. Please include details about the problem, your browser and device information, and any error messages you\'re seeing so we can help resolve the issue quickly.'
      }
    ]
  };

  // Hàm toggle để mở/đóng câu hỏi
  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Hàm lọc câu hỏi dựa trên search term
  const filteredFaqData = () => {
    if (!searchTerm.trim()) return faqData;

    const filtered = {};
    Object.keys(faqData).forEach(category => {
      const filteredQuestions = faqData[category].filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredQuestions.length > 0) {
        filtered[category] = filteredQuestions;
      }
    });
    return filtered;
  };

  // Icons cho từng category
  const categoryIcons = {
    'General Information': 'fa-question-circle',
    'Travel Planning': 'fa-map-marker-alt',
    'Safety & Guidelines': 'fa-shield-alt',
    'Technical Support': 'fa-calendar-alt'
  };

  return (
    <div className="queries-container">
      {/* Header Section */}
      <div className="queries-header">
        <h1 className="queries-title">Frequently Asked Questions</h1>
        <p className="queries-description">
          Find answers to common questions about BeautyOfBeaches, travel planning, and using our platform.
        </p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search questions and answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="faq-sections">
        {Object.keys(filteredFaqData()).map((category, categoryIndex) => (
          <div key={category} className="faq-category">
            {/* Category Header */}
            <div className="category-header">
              <span className="category-icon">
                <i className={`fas ${categoryIcons[category]}`}></i>
              </span>
              <h2 className="category-title">{category}</h2>
            </div>

            {/* Questions in this category */}
            <div className="questions-container">
              {filteredFaqData()[category].map((item, questionIndex) => {
                const key = `${categoryIndex}-${questionIndex}`;
                const isOpen = openQuestions[key];

                return (
                  <div key={questionIndex} className="question-item">
                    <button
                      className="question-button"
                      onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                    >
                      <span className="question-text">{item.question}</span>
                      <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} chevron-icon`}></i>
                    </button>
                    {isOpen && (
                      <div className="answer-container">
                        <p className="answer-text">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Still Have Questions Section */}
      <div className="support-section">
        <div className="support-content">
          <h2 className="support-title">Still Have Questions?</h2>
          <p className="support-description">
            Can't find what you're looking for? Our support team is here to help you with any questions about beaches, travel planning, or using our platform.
          </p>
          <div className="support-buttons">
            <button className="btn btn-outline-primary support-btn">
              Contact Support
            </button>
            <Link to="/feedback?source=queries" className="btn btn-primary support-btn" title="Submit feedback">
              Submit Feedback
            </Link>
          </div>
        </div>
      </div>

      {/* Travel Tips Section */}
      <div className="tips-section">
        <div className="tips-container">
          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <h3 className="tip-title">Travel Tips</h3>
            <p className="tip-description">Get insider tips for visiting beaches around the world</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3 className="tip-title">Safety First</h3>
            <p className="tip-description">Learn about beach safety and responsible tourism</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <h3 className="tip-title">Best Times</h3>
            <p className="tip-description">Find the perfect season for your beach destination</p>
          </div>
        </div>
      </div>

      {/* Travel to Paradise Section */}
      <div className="travel-section">
        <h2 className="travel-title">Travel to Paradise</h2>
        <div className="travel-options">
          <div className="travel-card">
            <div className="travel-icon">
              <i className="fas fa-plane"></i>
            </div>
            <h3 className="travel-card-title">Flights</h3>
            <p className="travel-card-description">Find the best flight deals to your dream beach destination</p>
          </div>
          <div className="travel-card">
            <div className="travel-icon">
              <i className="fas fa-bus"></i>
            </div>
            <h3 className="travel-card-title">Bus Tours</h3>
            <p className="travel-card-description">See comfort and convenience with guided bus tours</p>
          </div>
          <div className="travel-card">
            <div className="travel-icon">
              <i className="fas fa-car"></i>
            </div>
            <h3 className="travel-card-title">Car Rentals</h3>
            <p className="travel-card-description">Reserve your perfect vehicle for beach exploration</p>
          </div>
          <div className="travel-card">
            <div className="travel-icon">
              <i className="fas fa-ship"></i>
            </div>
            <h3 className="travel-card-title">Cruises</h3>
            <p className="travel-card-description">Embark on an unforgettable cruise adventure</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Queries;
