import React, { useEffect, useRef } from "react";
import "./Welcome.css";

const Welcome = () => {
  const lines = [
    "Welcome to Beauty Of Beaches",
    "Explore the Best Beaches of the World"
  ];

  const heroContentRef = useRef(null);

  const startAnimation = () => {
    if (heroContentRef.current) {
      // Remove existing animation classes
      const lines = heroContentRef.current.querySelectorAll('.animated-line');
      const chars = heroContentRef.current.querySelectorAll('.char');
      
      lines.forEach(line => {
        line.classList.remove('float-in');
      });
      
      chars.forEach(char => {
        char.classList.remove('float-in');
      });

      // Restart animation after a short delay
      setTimeout(() => {
        lines.forEach((line, lineIndex) => {
          setTimeout(() => {
            line.classList.add('float-in');
            
            // Animate each character with staggered timing
            const lineChars = line.querySelectorAll('.char');
            lineChars.forEach((char, charIndex) => {
              setTimeout(() => {
                char.classList.add('float-in');
              }, (lineIndex * 600) + (charIndex * 60));
            });
          }, lineIndex * 800);
        });
      }, 100);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (heroContentRef.current) {
      observer.observe(heroContentRef.current);
    }

    return () => {
      if (heroContentRef.current) {
        observer.unobserve(heroContentRef.current);
      }
    };
  }, []);

  return (
    <section className="hero-section">
      <div 
        className="hero-content" 
        ref={heroContentRef}
        onMouseEnter={startAnimation}
      >
        {lines.map((line, lineIndex) => (
          <h2 className="animated-line" key={lineIndex}>
            {line.split("").map((char, i) => (
              <span
                key={i}
                className="char"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
        ))}
      </div>
    </section>
  );
};

export default Welcome;
