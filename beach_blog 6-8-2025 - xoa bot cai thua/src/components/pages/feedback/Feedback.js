import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Feedback.css';
import { API_BASE_URL } from '../../../util/url';

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    beachId: '',
    message: '',
    rating: 5,
    attachment: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [beaches, setBeaches] = useState([]);
  const [loadingBeaches, setLoadingBeaches] = useState(true);
  const [beachesError, setBeachesError] = useState('');

  useEffect(() => {
    const loadBeaches = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/beaches.php`);
        const json = await res.json();
        if (json.status) {
          setBeaches(json.data || []);
        } else {
          setBeachesError(json.message || 'Không tải được danh sách bãi biển');
        }
      } catch (e) {
        setBeachesError(e.message);
      } finally {
        setLoadingBeaches(false);
      }
    };
    loadBeaches();
  }, []);

  // Prefill beach from URL (?beachId= or ?beach_id=)
  useEffect(() => {
    const paramId = searchParams.get('beachId') || searchParams.get('beach_id');
    if (paramId) {
      setFormData(prev => ({ ...prev, beachId: String(paramId) }));
    }
  }, [searchParams]);

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

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setFormData(prev => ({
      ...prev,
      attachment: file
    }));
    if (errors.attachment) {
      setErrors(prev => ({ ...prev, attachment: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.beachId) {
      newErrors.beachId = 'Please select a beach';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Tạo FormData để hỗ trợ upload file
        const formDataToSend = new FormData();
        formDataToSend.append('beach_id', parseInt(formData.beachId));
        formDataToSend.append('visitor_name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('rating', formData.rating);
        formDataToSend.append('feedback_comment', formData.message);
        
        // Thêm file nếu có
        if (formData.attachment) {
          formDataToSend.append('attachment', formData.attachment);
        }
        
        const response = await fetch(`${API_BASE_URL}/submit_feedback.php`, {
          method: 'POST',
          body: formDataToSend, // Không cần Content-Type header khi dùng FormData
        });
        
        const data = await response.json();
        
        if (data.status) {
          setIsSubmitted(true);
          setFormData({
            name: '',
            email: '',
            beachId: '',
            message: '',
            rating: 5,
            attachment: null
          });
        } else {
          alert('Error: ' + data.message);
        }
      } catch (error) {
        alert('Error submitting feedback: ' + error.message);
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="feedback-container">
        <div className="feedback-success">
          <div className="success-icon">✅</div>
          <h2>Thank you!</h2>
          <p>Your feedback has been submitted successfully! It will be reviewed by admin before being displayed.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsSubmitted(false)}
          >
            Send another feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-content">
        <div className="feedback-header">
          <h1>Send Feedback</h1>
          <p>We value your input to help improve our website!</p>
        </div>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
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
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="beachId">Select beach *</label>
            <select
              id="beachId"
              name="beachId"
              value={formData.beachId}
              onChange={handleChange}
              className={errors.beachId ? 'error' : ''}
            >
              <option value="">-- Select a beach --</option>
              {loadingBeaches && <option value="" disabled>Loading beaches...</option>}
              {!loadingBeaches && beachesError && <option value="" disabled>{beachesError}</option>}
              {!loadingBeaches && !beachesError && beaches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            {errors.beachId && <span className="error-message">{errors.beachId}</span>}
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
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? 'error' : ''}
              placeholder="Type your feedback..."
              rows="6"
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="attachment">Attachment (optional)</label>
            <input
              type="file"
              id="attachment"
              name="attachment"
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className={errors.attachment ? 'error' : ''}
            />
            {errors.attachment && <span className="error-message">{errors.attachment}</span>}
            {formData.attachment && <small>Selected: {formData.attachment.name}</small>}
          </div>

          <button type="submit" className="submit-btn">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
