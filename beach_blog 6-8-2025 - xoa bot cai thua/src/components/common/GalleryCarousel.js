import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "./GalleryCarousel.css";

const GalleryCarousel = () => {
  const galleryItems = [
    {
      id: 1,
      image: "https://worlds50beaches.com/assets/images/world-2025/011.webp",
      title: "Cala Goloritze (Italy)"
    },
    {
      id: 2,
      image: "https://worlds50beaches.com/assets/images/world-2025/021.webp",
      title: "Entalula Beach (Philippines)"
    },
    {
      id: 3,
      image: "https://worlds50beaches.com/assets/images/world-2025/031.webp",
      title: "Bang Bao Beach (Thailand)"
    },
    {
      id: 4,
      image: "https://worlds50beaches.com/assets/images/world-2025/041.webp",
      title: "Fteri Beach (Greece)"
    },
    {
      id: 5,
      image: "https://worlds50beaches.com/assets/images/world-2025/051.webp",
      title: "PK 9 Beach (French Polynesia)"
    },
    {
      id: 6,
      image: "https://worlds50beaches.com/assets/images/world-2025/061.webp",
      title: "Canto de la Playa (Dominican Republic)"
    },
    {
      id: 7,
      image: "https://worlds50beaches.com/assets/images/world-2025/071.webp",
      title: "Anse Source d'Argent (Seychelles)"
    },
    {
      id: 8,
      image: "https://worlds50beaches.com/assets/images/world-2025/081.webp",
      title: "Nosy Iranja (Madagascar)"
    },
    {
      id: 9,
      image: "https://worlds50beaches.com/assets/images/world-2025/091.webp",
      title: "Ofu Beach (American Samoa)"
    },
    {
      id: 10,
      image: "https://worlds50beaches.com/assets/images/world-2025/101.webp",
      title: "Grace Bay (Turks & Caicos)"
    }
  ];

  return (
    <section className="gallery-carousel-section">
      <div>
        <div className="row margin-leftright-null padding-sm">
          <div className="gallery-carousel">
            <Swiper
              modules={[Navigation, Autoplay, EffectFade]}
              spaceBetween={20}
              slidesPerView="auto"
              navigation={{
                nextEl: '.owl-next',
                prevEl: '.owl-prev',
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              speed={600}
              breakpoints={{
                320: {
                  slidesPerView: 2.2,
                  spaceBetween: 15,
                },
                480: {
                  slidesPerView: 3.2,
                  spaceBetween: 18,
                },
                768: {
                  slidesPerView: 4.2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 5.2,
                  spaceBetween: 20,
                },
                1200: {
                  slidesPerView: 6.2,
                  spaceBetween: 20,
                },
              }}
            >
              {galleryItems.map((item) => (
                <SwiperSlide key={item.id} className="owl-item">
                  <div className="item">
                    <div 
                      className="image" 
                      style={{ backgroundImage: `url(${item.image})` }}
                    >
                      <div className="overlay">
                        <h4>{item.title}</h4>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <div className="owl-controls">
              <div className="owl-nav">
                <div className="owl-prev">
                  <span>
                    <i className="icon ion-ios-arrow-left"></i>
                  </span>
                </div>
                <div className="owl-next">
                  <span>
                    <i className="icon ion-ios-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryCarousel;
