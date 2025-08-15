import React, { useState } from 'react'; // Thêm useState để quản lý loading state
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import './FeedbackSection.css';

const FeedbackSection = () => {
  const navigate = useNavigate(); // Hook để điều hướng
  const [isLoading, setIsLoading] = useState(false); // State để quản lý loading

  // Dữ liệu feedback giả lập với ảnh local
  const fakeFeedbacks = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing website with beautiful beach information!",
      date: "2024-01-15",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      comment: "Very user-friendly interface. The beach information is detailed.",
      date: "2024-01-10",
      imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Emma Davis",
      rating: 4,
      comment: "Love the photo gallery section. The beach images are stunning!",
      date: "2024-01-08",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "David Wilson",
      rating: 5,
      comment: "This website helped me plan my vacation perfectly!",
      date: "2024-01-05",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      name: "Lisa Brown",
      rating: 4,
      comment: "Hotel and transportation information is very helpful.",
      date: "2024-01-03",
      imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      name: "James Miller",
      rating: 5,
      comment: "Beautiful website with comprehensive information.",
      date: "2024-01-01",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    }
  ];

  // Hàm render sao đánh giá
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'active' : ''}`}>
        ⭐
      </span>
    ));
  };

  // Hàm xử lý khi click nút Send Feedback với loading state
  const handleSendFeedback = async () => {
    try {
      setIsLoading(true); // Bắt đầu loading
      // Simulate loading time (có thể thay bằng API call thực tế)
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/feedback'); // Chuyển hướng đến trang feedback
    } catch (error) {
      console.error('Error navigating to feedback page:', error);
      // Có thể thêm toast notification hoặc alert ở đây
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  return (
    <section className="feedback-section">
      <div className="container">
        {/* Tiêu đề section */}
        <div className="section-header text-center mb-4">
          <h2 className="section-title">Customer Reviews</h2>
          <p className="section-subtitle">
            What our beach lovers say about us
          </p>
        </div>

        {/* Grid hiển thị feedback */}
        <div className="row">
          {fakeFeedbacks.map((feedback) => (
            <div key={feedback.id} className="col-lg-4 col-md-6 mb-3">
              <div className="feedback-card">
                {/* Ảnh từ local */}
                <div className="feedback-image">
                  <img 
                    src={feedback.imageUrl} 
                    alt="Beach image"
                    className="img-fluid"
                  />
                </div>
                
                {/* Header card */}
                <div className="feedback-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      {feedback.name.charAt(0)}
                    </div>
                    <div className="user-details">
                      <h6 className="user-name">{feedback.name}</h6>
                      <div className="rating-stars">
                        {renderStars(feedback.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="feedback-date">
                    {new Date(feedback.date).toLocaleDateString('en-US')}
                  </div>
                </div>

                {/* Nội dung feedback */}
                <div className="feedback-content">
                  <p className="feedback-comment">"{feedback.comment}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nút Send Feedback - đã được liên kết với trang feedback */}
        <div className="text-center mt-3">
          <button 
            className={`btn btn-outline-primary ${isLoading ? 'loading' : ''}`}
            onClick={handleSendFeedback} // Thêm event handler để chuyển hướng
            disabled={isLoading} // Disable nút khi đang loading
            aria-label="Send feedback" // Thêm aria-label cho accessibility
            title="Click to send your feedback" // Thêm tooltip
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2" aria-hidden="true"></i> {/* Icon loading */}
                Redirecting...
              </>
            ) : (
              <>
                <i className="fas fa-comment-dots me-2" aria-hidden="true"></i> {/* Icon feedback */}
                Send Feedback
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
