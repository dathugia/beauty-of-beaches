import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TransportationSection from "../common/TransportationSection";
import { API_BASE_URL } from "../../util/url";
import "./Regions.css";

const Regions = () => {
  const { direction } = useParams();

  // Trạng thái dữ liệu, loading và lỗi
  const [beaches, setBeaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lấy dữ liệu bãi biển từ API một lần
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/beaches.php`);
        const json = await res.json();
        if (json.status) {
          setBeaches(Array.isArray(json.data) ? json.data : []);
        } else {
          setError(json.message || "Load failed");
        }
      } catch (e) {
        setError(e.message || "Network error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Map tiêu đề theo miền và hàm nhận diện miền từ region_name/city
  const directionMeta = useMemo(
    () => ({
      east: { title: "East Region Beaches", match: (t) => /\beast\b/i.test(t) },
      west: { title: "West Region Beaches", match: (t) => /\bwest\b/i.test(t) },
      north: { title: "North Region Beaches", match: (t) => /\bnorth\b/i.test(t) },
      south: { title: "South Region Beaches", match: (t) => /\bsouth\b/i.test(t) },
    }),
    []
  );

  // Tạo danh sách theo miền dựa trên dữ liệu thật từ API
  const groupedByDirection = useMemo(() => {
    const groups = { east: [], west: [], north: [], south: [] };
    beaches.forEach((b) => {
      const text = `${b.region_name || ""} ${b.city || ""}`.toLowerCase();
      (Object.keys(directionMeta)).forEach((dir) => {
        if (directionMeta[dir].match(text)) {
          groups[dir].push(b);
        }
      });
    });
    return groups;
  }, [beaches, directionMeta]);

  // Trang tổng quan các miền
  if (!direction) {
    return (
      <div className="regions-container">
        <div className="container mt-5 pt-5">
          <h1 className="text-center mb-5">Explore Beach Regions</h1>
          <div className="row">
            {Object.entries(directionMeta).map(([dir, meta]) => (
              <div key={dir} className="col-md-6 col-lg-3 mb-4">
                <div className="region-card">
                  <h3>{meta.title}</h3>
                  <p>Discover beautiful beaches in the {dir} region</p>
                  <Link to={`/regions/${dir}`} className="btn btn-primary">
                    Explore {dir.charAt(0).toUpperCase() + dir.slice(1)}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <TransportationSection />
      </div>
    );
  }

  // Khi có direction cụ thể
  const dirKey = String(direction).toLowerCase();
  const currentMeta = directionMeta[dirKey];

  if (!currentMeta) {
    return (
      <div className="container mt-5 pt-5">
        <h1>Region not found</h1>
        <p>The requested region does not exist.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5 pt-5">
        <p>Loading beaches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 pt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const beachesOfRegion = groupedByDirection[dirKey] || [];

  return (
    <div className="regions-container">
      <div className="container mt-5 pt-5">
        <h1 className="text-center mb-5">{currentMeta.title}</h1>
        <div className="row">
          {beachesOfRegion.map((beach) => (
            <div key={beach.id} className="col-md-6 col-lg-4 mb-4">
              <div className="beach-card h-100">
                <div className="beach-image">
                  <img
                    src={beach.image_url || `https://source.unsplash.com/400x300/?beach,${encodeURIComponent(beach.name || "beach")}`}
                    alt={beach.name}
                    className="img-fluid"
                  />
                </div>
                <div className="beach-info d-flex flex-column">
                  <h3>{beach.name}</h3>
                  <p className="country">{beach.national || beach.country || ""}</p>
                  <p className="description">{beach.description || ""}</p>
                  <div className="mt-auto">
                    <Link to={`/beach/${beach.id}`} className="btn btn-outline-primary">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {beachesOfRegion.length === 0 && (
            <div className="col-12">
              <div className="alert alert-info">No beaches found for this region.</div>
            </div>
          )}
        </div>
      </div>
      <TransportationSection direction={dirKey} beaches={beachesOfRegion} />
    </div>
  );
};

export default Regions;
