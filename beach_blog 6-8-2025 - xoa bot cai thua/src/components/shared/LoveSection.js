import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LoveSection.css';

const LoveSection = () => {
  const imageRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.3 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section__love">
      <div className="love__container">
        <div className="love">
          <div className="love__content" ref={titleRef}>
            <h2 className="love__main-title">
              For the love of beaches.
            </h2>
            <p className="love__subtitle">
              Created by beach lovers, for beach lovers.
            </p>
            <p className="love__description">
              We understand the amazing impact that a truly exceptional beach can have on one's mood and sense of well-being. It is our hope that through The World's 50 Best Beaches, we can inspire others to embark on their own beach adventures, to explore the wonders of nature, and to experience the joy that can be found along the world's most stunning shorelines.
            </p>
            <Link to="/about" className="love__read-more">
              Read more
            </Link>
          </div>
          <div className="love__image-wrapper" ref={imageRef}>
            <img 
              className="love__image" 
              src="https://worlds50beaches.com/assets/images/love_img.webp" 
              alt="Maya Bay, Thailand"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoveSection;
