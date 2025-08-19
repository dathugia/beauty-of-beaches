import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { Col, Container, Row, Card, Alert, Spinner } from "react-bootstrap"; // Import Bootstrap components
import { API_BASE_URL } from "../../util/url";
import BeachHeader from "./BeachHeader"; // Import BeachHeader component
import "./BeachDetail.css"; // Import CSS file

const BeachDetail = () => {
    // Lấy id từ URL params
    const { id } = useParams();
    const navigate = useNavigate(); // Thêm navigate hook
    // State để lưu thông tin bãi biển
    const [beach, setBeach] = useState({});
    // State để lưu galleries của beach
    const [galleries, setGalleries] = useState([]);
    // State để hiển thị loading
    const [loading, setLoading] = useState(true);
    // State để lưu lỗi
    const [error, setError] = useState('');
    // State để quản lý lightbox gallery
    const [selectedImage, setSelectedImage] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    // State để quản lý form feedback
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [feedbackData, setFeedbackData] = useState({
        name: '',
        email: '',
        message: '',
        rating: 5,
        attachment: null
    });
    const [feedbackErrors, setFeedbackErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Feedback list for this beach (approved only, max 3 from API)
    const [feedbacks, setFeedbacks] = useState([]);
    const [loadingFeedback, setLoadingFeedback] = useState(true);
    const [feedbackLoadError, setFeedbackLoadError] = useState('');

    // Hàm mở lightbox
    const openLightbox = (imageUrl, index) => {
        setSelectedImage(imageUrl);
        setLightboxIndex(index);
    };

    // Hàm đóng lightbox
    const closeLightbox = () => {
        setSelectedImage(null);
        setLightboxIndex(0);
    };

    // Hàm chuyển ảnh trong gallery (3 ảnh mỗi lần)
    const showPrevGallery = () => {
        if (galleries.length > 0) {
            const newIndex = Math.max(0, lightboxIndex - 3);
            setLightboxIndex(newIndex);
        }
    };

    const showNextGallery = () => {
        if (galleries.length > 0) {
            const newIndex = Math.min(galleries.length - 3, lightboxIndex + 3);
            setLightboxIndex(newIndex);
        }
    };

    // Hàm chuyển ảnh trong lightbox (1 ảnh mỗi lần)
    const showPrevImage = () => {
        if (galleries.length > 0) {
            const newIndex = (lightboxIndex - 1 + galleries.length) % galleries.length;
            setLightboxIndex(newIndex);
            setSelectedImage(galleries[newIndex].image_url);
        }
    };

    const showNextImage = () => {
        if (galleries.length > 0) {
            const newIndex = (lightboxIndex + 1) % galleries.length;
            setLightboxIndex(newIndex);
            setSelectedImage(galleries[newIndex].image_url);
        }
    };

    // Hàm xử lý phím tắt cho lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedImage) {
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    showPrevImage();
                } else if (e.key === 'ArrowRight') {
                    showNextImage();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, lightboxIndex, galleries]);

    // Load approved feedbacks (latest 3) for this beach
    useEffect(() => {
        const loadFeedbacks = async () => {
            try {
                setLoadingFeedback(true);
                const res = await fetch(`${API_BASE_URL}/beach_feedback.php?beach_id=${id}`);
                const json = await res.json();
                if (json.status) {
                    setFeedbacks(json.data || []);
                } else {
                    setFeedbackLoadError(json.message || 'Không tải được đánh giá');
                }
            } catch (e) {
                setFeedbackLoadError(e.message);
            } finally {
                setLoadingFeedback(false);
            }
        };
        loadFeedbacks();
    }, [id]);

    const renderStaticStars = (rating) => {
        const safe = Math.max(0, Math.min(5, parseInt(rating || 0)));
        return '⭐'.repeat(safe) + '☆'.repeat(5 - safe);
    };

    // Hàm render stars cho rating
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <button
                key={index}
                type="button"
                className={`star-btn ${index < rating ? 'active' : ''}`}
                onClick={() => setFeedbackData(prev => ({ ...prev, rating: index + 1 }))}
            >
                ⭐
            </button>
        ));
    };

    // Hàm xử lý thay đổi input
    const handleFeedbackChange = (e) => {
        const { name, value, type, files } = e.target;
        setFeedbackData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
        if (feedbackErrors[name]) {
            setFeedbackErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Hàm validate form
    const validateFeedbackForm = () => {
        const newErrors = {};

        if (!feedbackData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!feedbackData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(feedbackData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!feedbackData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (feedbackData.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters long';
        }

        setFeedbackErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Hàm download thông tin bãi biển (server-generated, từ DB)
    const downloadBeachInfo = () => {
        try {
            const url = `${API_BASE_URL}/download_beach.php?id=${id}`;
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.target = '_blank';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        } catch (error) {
            console.error('Error downloading beach info:', error);
            alert('Error downloading beach information');
        }
    };

    // Hàm submit feedback
    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();

        if (validateFeedbackForm()) {
            setIsSubmitting(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Reset form
                setFeedbackData({
                    name: '',
                    email: '',
                    message: '',
                    rating: 5,
                    attachment: null
                });
                setShowFeedbackForm(false);
                alert('Thank you for your feedback!');
            } catch (error) {
                console.error('Error submitting feedback:', error);
                alert('Error submitting feedback. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Hàm fetch data từ API
    const getBeachDetail = async () => {
        try {
            // Gọi API để lấy chi tiết bãi biển theo ID
            const response = await fetch(`${API_BASE_URL}/beach.php?id=${id}`);
            const json = await response.json();
            
            // Kiểm tra status từ API
            if (json.status) {
                setBeach(json.data); // Lưu data vào state
            } else {
                setError(json.message || 'Không tìm thấy bãi biển'); // Lưu lỗi
            }

            // Gọi API để lấy galleries của beach này
            const galleriesResponse = await fetch(`${API_BASE_URL}/galleries.php`);
            const galleriesJson = await galleriesResponse.json();
            
            if (galleriesJson.status) {
                // Lọc galleries chỉ cho beach hiện tại
                const beachGalleries = galleriesJson.data.filter(gallery => 
                    gallery.beach_id == id
                );
                setGalleries(beachGalleries);
            }
        } catch (e) {
            setError('Lỗi kết nối: ' + e.message); // Lưu lỗi network
        } finally {
            setLoading(false); // Tắt loading
        }
    };

    // useEffect để fetch data khi component mount hoặc id thay đổi
    useEffect(() => {
        getBeachDetail();
    }, [id]);

    // Hiển thị loading spinner
    if (loading) return (
        <Container className="text-center p-5">
            <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Đang tải thông tin bãi biển...</p>
        </Container>
    );

    // Hiển thị lỗi nếu có
    if (error) return (
        <Container className="p-5">
            <Alert variant="danger">
                <Alert.Heading>Lỗi!</Alert.Heading>
                <p>{error}</p>
            </Alert>
        </Container>
    );

    return (
        <>
            {/* CSS để đảm bảo ảnh gallery có cùng kích thước */}
            <style>
                {`
                    .gallery-image {
                        width: 100% !important;
                        height: 100% !important;
                        object-fit: cover !important;
                        object-position: center !important;
                        min-width: 100% !important;
                        min-height: 100% !important;
                        max-width: 100% !important;
                        max-height: 100% !important;
                        display: block !important;
                    }
                    .gallery-item {
                        flex: 1 !important;
                        height: 600px !important;
                        width: calc(33.333% - 7px) !important;
                        position: relative !important;
                        border-radius: 8px !important;
                        overflow: hidden !important;
                        cursor: pointer !important;
                        min-width: 0 !important;
                        flex-shrink: 0 !important;
                    }
                `}
            </style>
            
            {/* BeachHeader component với thông tin bãi biển */}
            <BeachHeader currentBeachId={id} beachData={beach} />
            
            <Container className="mt-5">
            {/* Mô tả HTML đầy đủ */}
            <div className="mb-4">
                {/* <h4 className="mb-3">
                    <i className="fas fa-info-circle me-2 text-info"></i>
                    Mô tả chi tiết
                </h4> */}
                <div 
                    className="beach-description"
                    dangerouslySetInnerHTML={{ __html: beach.description || '' }}
                    style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        maxHeight: '600px',
                        overflowY: 'auto' // Cho phép scroll nếu nội dung dài
                    }}
                />
            </div>

            {/* Phần Gallery - Hiển thị 3 ảnh cố định */}
            {galleries.length > 0 && (
                <div className="mb-4">
                    {/* <h4 className="mb-4">
                        <i className="fas fa-images me-2 text-primary"></i>
                        Photo Gallery
                    </h4> */}
                    <div className="gallery-container" style={{
                        position: 'relative',
                        width: '100%',
                        height: '600px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'stretch',
                        justifyContent: 'space-between'
                    }}>
                        {/* Hiển thị 3 ảnh đầu tiên cố định */}
                        {galleries.slice(0, 3).map((gallery, index) => (
                            <div 
                                key={gallery.id}
                                className="gallery-item"
                                style={{ position: 'relative' }}
                            >
                                <img 
                                    src={gallery.image_url} 
                                    alt={`${beach.name} - Image ${index + 1}`}
                                    className="gallery-image"
                                />
                                
                                {/* Overlay "Xem nhiều ảnh hơn" trên ảnh thứ 3 */}
                                {index === 2 && galleries.length > 3 && (
                                    <div 
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'rgba(0,0,0,0.6)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.8)'}
                                        onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.6)'}
                                        onClick={() => navigate(`/gallery?beach_id=${id}`)}
                                    >
                                        <div style={{
                                            textAlign: 'center',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '16px'
                                        }}>
                                            <i className="fas fa-images mb-2" style={{ fontSize: '24px', display: 'block' }}></i>
                                            Xem nhiều ảnh hơn
                                            <br />
                                            <small style={{ fontSize: '12px', opacity: 0.8 }}>
                                                +{galleries.length - 3} ảnh khác
                                            </small>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Phần Tips */}
            {beach.tips && (
                <div className="mb-4">
                    {/* <h4 className="mb-3">
                        <i className="fas fa-lightbulb me-2 text-warning"></i>
                        Mẹo du lịch
                    </h4> */}
                    <div 
                        className="beach-tips"
                        dangerouslySetInnerHTML={{ __html: beach.tips || '' }}
                        style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                            backgroundColor: '#fff3cd',
                            border: '1px solid #ffeaa7',
                            borderRadius: '8px',
                            padding: '20px',
                            color: '#856404'
                        }}
                    />
                </div>
            )}
            

            {/* Visitor Reviews (Approved, latest 3) */}
            <div className="mb-4">
                {/* <h4 className="mb-3">
                    <i className="fas fa-comments me-2 text-primary"></i>
                    Visitor Reviews
                </h4> */}
                {loadingFeedback ? (
                    <div className="text-muted">Loading reviews...</div>
                ) : feedbackLoadError ? (
                    <div className="text-danger">{feedbackLoadError}</div>
                ) : feedbacks.length === 0 ? (
                    <div className="text-muted">No reviews yet.</div>
                ) : (
                    <div className="list-group">
                        {feedbacks.slice(0, 3).map((fb, idx) => (
                            <div key={idx} className="list-group-item">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <strong>{fb.visitor_name}</strong>
                                        <div className="small text-muted">{renderStaticStars(fb.rating)} ({fb.rating}/5)</div>
                                    </div>
                                    <small className="text-muted">{new Date(fb.created_at).toLocaleDateString('vi-VN')}</small>
                                </div>
                                <div className="mt-2">{fb.feedback_comment}</div>
                                {fb.attachment_path && (
                                    <div className="mt-2">
                                        <a 
                                            href={`${API_BASE_URL}/${fb.attachment_path}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            <i className="fas fa-paperclip me-1"></i>
                                            View attachment
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-3 d-flex gap-2">
                    <a className="btn btn-outline-primary btn-sm" href={`/feedback?beachId=${id}`}>
                        <i className="fas fa-pen me-2"></i>
                        Write a review
                    </a>
                    <button 
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={downloadBeachInfo}
                    >
                        <i className="fas fa-download me-2"></i>
                        Download info
                    </button>
                </div>
            </div>
            </Container>

            {/* Lightbox Gallery */}
            {selectedImage && (
                <div 
                    className="lightbox-overlay"
                    onClick={closeLightbox}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div 
                        className="lightbox-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            maxWidth: '90vw',
                            maxHeight: '90vh'
                        }}
                    >
                        <img 
                            src={selectedImage} 
                            alt={`${beach.name} - Gallery Image`}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain'
                            }}
                        />
                        
                        {/* Close button */}
                        <button 
                            onClick={closeLightbox}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                fontSize: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.9)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.7)'}
                        >
                            ×
                        </button>
                        
                        {/* Navigation arrows - Previous */}
                        {galleries.length > 1 && (
                            <button 
                                onClick={showPrevImage}
                                style={{
                                    position: 'absolute',
                                    left: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '60px',
                                    height: '60px',
                                    fontSize: '28px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(0,0,0,0.9)';
                                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(0,0,0,0.7)';
                                    e.target.style.transform = 'translateY(-50%) scale(1)';
                                }}
                            >
                                ‹
                            </button>
                        )}
                        
                        {/* Navigation arrows - Next */}
                        {galleries.length > 1 && (
                            <button 
                                onClick={showNextImage}
                                style={{
                                    position: 'absolute',
                                    right: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '60px',
                                    height: '60px',
                                    fontSize: '28px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(0,0,0,0.9)';
                                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(0,0,0,0.7)';
                                    e.target.style.transform = 'translateY(-50%) scale(1)';
                                }}
                            >
                                ›
                            </button>
                        )}
                        
                        {/* Image counter */}
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '25px',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}>
                            {lightboxIndex + 1} / {galleries.length}
                        </div>
                        
                        {/* Caption - Bỏ qua HTML tags */}
                        {galleries[lightboxIndex]?.caption && (
                            <div style={{
                                position: 'absolute',
                                bottom: '80px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                padding: '15px 25px',
                                borderRadius: '10px',
                                fontSize: '16px',
                                maxWidth: '80%',
                                textAlign: 'center'
                            }}>
                                {galleries[lightboxIndex].caption.replace(/<[^>]*>/g, '')}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default BeachDetail;

