import React, { useState } from 'react';
import './Feedback.css';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 5
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên là bắt buộc';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Tiêu đề là bắt buộc';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Nội dung là bắt buộc';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Nội dung phải có ít nhất 10 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate API call
      setTimeout(() => {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          rating: 5
        });
      }, 1000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="feedback-container">
        <div className="feedback-success">
          <div className="success-icon">✅</div>
          <h2>Cảm ơn bạn!</h2>
          <p>Phản hồi của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsSubmitted(false)}
          >
            Gửi phản hồi khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-content">
        <div className="feedback-header">
          <h1>Gửi Phản Hồi</h1>
          <p>Chúng tôi rất mong nhận được ý kiến đóng góp từ bạn để cải thiện website!</p>
        </div>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Họ và tên *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Nhập họ và tên của bạn"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Nhập email của bạn"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="subject">Tiêu đề *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={errors.subject ? 'error' : ''}
              placeholder="Nhập tiêu đề phản hồi"
            />
            {errors.subject && <span className="error-message">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="rating">Đánh giá</label>
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star ${star <= formData.rating ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                >
                  ⭐
                </button>
              ))}
              <span className="rating-text">{formData.rating}/5 sao</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Nội dung phản hồi *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? 'error' : ''}
              placeholder="Nhập nội dung phản hồi của bạn..."
              rows="6"
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>

          <button type="submit" className="submit-btn">
            Gửi Phản Hồi
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
