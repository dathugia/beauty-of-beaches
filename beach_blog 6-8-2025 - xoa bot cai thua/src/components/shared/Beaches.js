import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../util/url';

const Beaches = () => {
  const [beaches, setBeaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/beaches.php`);
        const json = await res.json();
        if (json.status) {
          setBeaches(json.data || []);
        } else {
          setError(json.message || 'Load failed');
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Đang tải danh sách bãi biển…</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <section className="featured-beaches">
      <div className="featured-beaches__header">
        <div className="featured-beaches__title-section">
          <h2 className="featured-beaches__title">Top Beaches</h2>
          <p className="featured-beaches__subtitle">
            Dữ liệu từ API PHP (beaches.php)
          </p>
        </div>
      </div>

      <div className="featured-beaches__grid">
        {beaches.map((b) => (
          <div key={b.id} className="beach-card">
            <div className="beach-card__image-container">
              <img className="beach-card__image" src={b.image_url} alt={b.name} />
            </div>
            <div className="beach-card__content">
              <div className="beach-card__info">
                <h3 className="beach-card__name">{b.name}</h3>
                <p className="beach-card__country">Region ID: {b.region_id}</p>
                <div 
                  className="beach-card__description"
                  dangerouslySetInnerHTML={{ __html: b.description || '' }}
                  style={{ 
                    maxHeight: '200px', 
                    overflow: 'hidden',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}
                />
                <Link to={`/beach/${b.id}`} className="btn btn-outline-primary mt-2">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Beaches;
