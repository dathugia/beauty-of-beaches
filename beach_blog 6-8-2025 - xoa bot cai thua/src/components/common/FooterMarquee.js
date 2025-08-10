import React, { useState, useEffect } from "react";
import "./FooterMarquee.css";

const FooterMarquee = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [location, setLocation] = useState("Detecting...");

  // Cập nhật thời gian mỗi giây
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const timeStr = now.toLocaleTimeString("en-US");
      setCurrentTime(`${dateStr} at ${timeStr}`);
    };

    updateClock(); // lần đầu
    const interval = setInterval(updateClock, 1000); // cập nhật mỗi giây
    return () => clearInterval(interval);
  }, []);

  // Lấy vị trí từ trình duyệt và convert thành tên địa điểm
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Sử dụng Reverse Geocoding API để lấy tên địa điểm
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            if (data.city && data.countryName) {
              setLocation(`${data.city}, ${data.countryName}`);
            } else if (data.locality && data.countryName) {
              setLocation(`${data.locality}, ${data.countryName}`);
            } else {
              setLocation(`${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`);
            }
          } catch (error) {
            // Fallback nếu API không hoạt động
            setLocation(`${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`);
          }
        },
        (error) => {
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setLocation("Location access denied");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocation("Location unavailable");
              break;
            case error.TIMEOUT:
              setLocation("Location timeout");
              break;
            default:
              setLocation("Location error");
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 phút
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  return (
    <footer className="marquee-footer">
      <div className="marquee-text">
        📅 {currentTime} ⎯ 📍 Your Location: {location} ⎯ 🌊 Welcome to BeachBlog - Discover Paradise 🌊 ⎯ ✈️ Book your dream beach vacation today! ✈️
      </div>
    </footer>
  );
};

export default FooterMarquee;
