import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../util/url';
import './BeachHeader.css';

const BeachHeader = ({ currentBeachId, beachData }) => {
    const navigate = useNavigate();
    const [allBeaches, setAllBeaches] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Hàm fetch tất cả bãi biển để điều hướng
    const fetchAllBeaches = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/beaches.php`);
            const json = await response.json();
            
            if (json.status) {
                setAllBeaches(json.data);
                // Tìm index của bãi biển hiện tại
                const index = json.data.findIndex(beach => beach.id == currentBeachId);
                setCurrentIndex(index >= 0 ? index : 0);
            }
        } catch (error) {
            console.error('Error fetching beaches:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm điều hướng đến bãi biển trước đó
    const goToPreviousBeach = () => {
        if (currentIndex > 0) {
            const prevBeach = allBeaches[currentIndex - 1];
            navigate(`/beach/${prevBeach.id}`);
        }
    };

    // Hàm điều hướng đến bãi biển tiếp theo
    const goToNextBeach = () => {
        if (currentIndex < allBeaches.length - 1) {
            const nextBeach = allBeaches[currentIndex + 1];
            navigate(`/beach/${nextBeach.id}`);
        }
    };

    // useEffect để fetch data khi component mount
    useEffect(() => {
        fetchAllBeaches();
    }, [currentBeachId]);

    // Nếu đang loading hoặc chưa có data
    if (loading || !beachData) {
        return (
            <div className="beach-header-container">
                <div className="beach-header-background">
                    <div className="beach-header-content">
                        <div className="beach-header-loading">
                            <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const prevBeach = currentIndex > 0 ? allBeaches[currentIndex - 1] : null;
    const nextBeach = currentIndex < allBeaches.length - 1 ? allBeaches[currentIndex + 1] : null;

    return (
        <div className="beach-header-container">
            {/* Background image với overlay */}
            <div 
                className="beach-header-background"
                style={{
                    backgroundImage: beachData.image_url ? `url(${beachData.image_url})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
            >
                {/* Overlay để text dễ đọc */}
                <div className="beach-header-overlay"></div>
                
                {/* Nội dung chính */}
                <div className="beach-header-content">
                    {/* Nút điều hướng bên trái */}
                    {prevBeach && (
                        <div className="beach-nav-left">
                            <button 
                                className="beach-nav-button"
                                onClick={goToPreviousBeach}
                                title={`Previous: ${prevBeach.name}`}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <div className="beach-nav-info">
                                <div className="beach-nav-rank">#{prevBeach.rank || currentIndex}</div>
                                <div className="beach-nav-name">{prevBeach.name}</div>
                                <div className="beach-nav-country">{prevBeach.national}</div>
                            </div>
                        </div>
                    )}

                    {/* Thông tin bãi biển hiện tại */}
                    <div className="beach-header-main">
                        <div className="beach-header-card">
                            <h1 className="beach-header-title">{beachData.name}</h1>
                            <div className="beach-header-country">{beachData.national}</div>
                            <div className="beach-header-separator">
                                <div className="separator-line"></div>
                                <div className="separator-diamond"></div>
                                <div className="separator-line"></div>
                            </div>
                            <div className="beach-header-rank">#{beachData.rank || (currentIndex + 1)} IN THE WORLD</div>
                        </div>
                    </div>

                    {/* Nút điều hướng bên phải */}
                    {nextBeach && (
                        <div className="beach-nav-right">
                            <div className="beach-nav-info">
                                <div className="beach-nav-rank">#{nextBeach.rank || (currentIndex + 2)}</div>
                                <div className="beach-nav-name">{nextBeach.name}</div>
                                <div className="beach-nav-country">{nextBeach.national}</div>
                            </div>
                            <button 
                                className="beach-nav-button"
                                onClick={goToNextBeach}
                                title={`Next: ${nextBeach.name}`}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BeachHeader;
