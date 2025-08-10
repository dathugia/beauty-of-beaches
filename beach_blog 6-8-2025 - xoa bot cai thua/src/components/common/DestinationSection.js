import React from "react";
import "./DestinationSection.css"; // Import your CSS file for styling

const places = [
  { name: "Phú Quốc", img: "https://cdn1.ivivu.com/images/2025/04/16/13/phuquoc_show_ebkmxx_.webp" },
  { name: "Đà Lạt", img: "https://cdn1.ivivu.com/images/2025/04/16/10/dalat_show_2ancd3_.webp" },
  { name: "Quy Nhơn", img: "https://cdn1.ivivu.com/images/2025/04/18/11/quynhon_show_bymdwj_.webp" },
  { name: "Vũng Tàu", img: "https://cdn1.ivivu.com/images/2025/04/21/14/vungtau_show_mnw3ej_.webp" },
  { name: "Nha Trang", img: "https://cdn1.ivivu.com/images/2025/04/16/11/nhatrang_show_su3sb3_.webp" },
  { name: "Đà Nẵng", img: "https://cdn1.ivivu.com/images/2025/04/16/11/danang_show_2lamnx_.webp" },
  { name: "Phan Thiết", img: "https://cdn1.ivivu.com/images/2025/04/16/11/phanthiet_show_wrdctj_.webp" },
  { name: "Phú Yên", img: "https://cdn1.ivivu.com/images/2025/04/16/11/phuyen_show_vtndp3_.webp" },
];

const DestinationSection = () => {
  return (
    <section className="section">
      <h2 className="title p-2">Featured Beaches</h2>
      <div className="grid">
        {places.map((place, i) => (
          <div key={i} className="item" style={{ backgroundImage: `url(${place.img})` }}>
            <div className="overlay"><h4>{place.name}</h4></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DestinationSection;
