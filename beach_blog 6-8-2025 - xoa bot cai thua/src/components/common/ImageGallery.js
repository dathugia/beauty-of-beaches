import React, { useState } from "react";
import "./ImageGallery.css"; // CSS riêng cho gallery

const images = [
  "https://demo.deverust.com/coralbay/wp-content/uploads/sites/51/2025/04/IMG-BN7RZVD.jpg",
    "https://demo.deverust.com/coralbay/wp-content/uploads/sites/51/2025/04/IMG-BN7RZVD.jpg",
  "https://demo.deverust.com/coralbay/wp-content/uploads/sites/51/2025/04/IMG-BN7RZVD.jpg",
  "https://demo.deverust.com/coralbay/wp-content/uploads/sites/51/2025/04/IMG-BN7RZVD.jpg"

];

const ImageGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="container-img py-4">
      <h2 className="text-center mb-4">Gallery</h2>
      <div className="row">
        {images.map((src, idx) => (
          <div className="col-6 col-md-3 mb-3" key={idx}>
            <img
              src={src}
              alt={`Ảnh ${idx}`}
              className="img-fluid gallery-thumb"
              onClick={() => setSelectedImage(src)}
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content">
            <img src={selectedImage} alt="Ảnh lớn" className="lightbox-img" />
            <span className="lightbox-close" onClick={() => setSelectedImage(null)}>&times;</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
