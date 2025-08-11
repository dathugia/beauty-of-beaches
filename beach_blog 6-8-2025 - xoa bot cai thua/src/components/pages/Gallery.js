import React from "react";
import Beaches from "../shared/Beaches";

const Gallery = () => {
  return (
    <div className="gallery-page">
      <div className="container mt-5 pt-5">
        <div className="text-center mb-5">
          <h1 className="display-4">Top 50 Bãi Biển Đẹp Nhất Thế Giới</h1>
          <p className="lead">Khám phá những bãi biển tuyệt đẹp từ khắp nơi trên thế giới</p>
        </div>
      </div>
      <Beaches />
    </div>
  );
};

export default Gallery;
