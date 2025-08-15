import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row, Card, Alert, Spinner } from "react-bootstrap"; // Import Bootstrap components
import { API_BASE_URL } from "../../util/url";
import BeachHeader from "./BeachHeader"; // Import BeachHeader component
import "./BeachDetail.css"; // Import CSS file

const BeachDetail = () => {
    // Lấy id từ URL params
    const { id } = useParams();
    // State để lưu thông tin bãi biển
    const [beach, setBeach] = useState({});
    // State để hiển thị loading
    const [loading, setLoading] = useState(true);
    // State để lưu lỗi
    const [error, setError] = useState('');
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

    // Hàm download thông tin bãi biển
    const downloadBeachInfo = () => {
        try {
            // Tạo nội dung file từ thông tin bãi biển hiện tại
            const content = `
BEACH INFORMATION
=================

Name: ${beach.name || 'Not available'}
Location: ${beach.national || ''} - ${beach.region_name || ''}

DESCRIPTION:
${beach.description ? beach.description.replace(/<[^>]*>/g, '') : 'No description available'}

TRAVEL TIPS:
${beach.tips ? beach.tips.replace(/<[^>]*>/g, '') : 'No tips available'}

ADDITIONAL INFORMATION:
- Image URL: ${beach.image_url || 'Not available'}
- Region: ${beach.region_name || 'Not available'}
- Country: ${beach.national || 'Not available'}

Generated on: ${new Date().toLocaleDateString()}
Source: Beauty of Beaches
            `.trim();

            // Tạo blob và download
            const blob = new Blob([content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${beach.name ? beach.name.replace(/[^a-zA-Z0-9]/g, '_') : 'beach'}_info.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
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

            {/* Phần Download và Feedback */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">
                        <i className="fas fa-comments me-2 text-primary"></i>
                        Share Your Experience
                    </h4>
                    <button 
                        className="btn btn-outline-success"
                        onClick={() => downloadBeachInfo()}
                        title="Download beach information"
                    >
                        <i className="fas fa-download me-2"></i>
                        Download Info
                    </button>
                </div>
                
                {!showFeedbackForm ? (
                    <div className="text-center py-4">
                        <i className="fas fa-comment-plus text-muted mb-3" style={{fontSize: '2rem'}}></i>
                        <p className="text-muted mb-3">Share your experience at this beautiful beach!</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowFeedbackForm(true)}
                        >
                            <i className="fas fa-plus me-2"></i>
                            Write a Review
                        </button>
                    </div>
                ) : (
                    <Card className="feedback-form-card">
                        <Card.Body>
                            <form onSubmit={handleFeedbackSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="name" className="form-label">Full Name *</label>
                                        <input
                                            type="text"
                                            className={`form-control ${feedbackErrors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            name="name"
                                            value={feedbackData.name}
                                            onChange={handleFeedbackChange}
                                            placeholder="Enter your full name"
                                        />
                                        {feedbackErrors.name && (
                                            <div className="invalid-feedback">{feedbackErrors.name}</div>
                                        )}
                                    </div>
                                    
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="email" className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            className={`form-control ${feedbackErrors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email"
                                            value={feedbackData.email}
                                            onChange={handleFeedbackChange}
                                            placeholder="Enter your email"
                                        />
                                        {feedbackErrors.email && (
                                            <div className="invalid-feedback">{feedbackErrors.email}</div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Rating</label>
                                    <div className="rating-container">
                                        {renderStars(feedbackData.rating)}
                                        <span className="rating-text ms-2">{feedbackData.rating}/5 stars</span>
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message *</label>
                                    <textarea
                                        className={`form-control ${feedbackErrors.message ? 'is-invalid' : ''}`}
                                        id="message"
                                        name="message"
                                        rows="4"
                                        value={feedbackData.message}
                                        onChange={handleFeedbackChange}
                                        placeholder="Share your experience at this beach..."
                                    />
                                    {feedbackErrors.message && (
                                        <div className="invalid-feedback">{feedbackErrors.message}</div>
                                    )}
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="attachment" className="form-label">Attachment (optional)</label>
                                    <input
                                        type="file"
                                        className={`form-control ${feedbackErrors.attachment ? 'is-invalid' : ''}`}
                                        id="attachment"
                                        name="attachment"
                                        onChange={handleFeedbackChange}
                                        accept="image/*,application/pdf"
                                    />
                                    {feedbackData.attachment && (
                                        <small className="text-muted d-block mt-1">
                                            <i className="fas fa-file me-1"></i>
                                            Selected file: {feedbackData.attachment.name}
                                        </small>
                                    )}
                                    {feedbackErrors.attachment && (
                                        <div className="invalid-feedback">{feedbackErrors.attachment}</div>
                                    )}
                                </div>
                                
                                <div className="d-flex gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane me-2"></i>
                                                Submit Feedback
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowFeedbackForm(false)}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </Card.Body>
                    </Card>
                )}
            </div>
            </Container>
        </>
    );
};

export default BeachDetail;
