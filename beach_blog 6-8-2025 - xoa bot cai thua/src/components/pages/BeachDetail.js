import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row, Card, Alert, Spinner } from "react-bootstrap"; // Import Bootstrap components
import { API_BASE_URL } from "../../util/url";

const BeachDetail = () => {
    // Lấy id từ URL params
    const { id } = useParams();
    // State để lưu thông tin bãi biển
    const [beach, setBeach] = useState({});
    // State để hiển thị loading
    const [loading, setLoading] = useState(true);
    // State để lưu lỗi
    const [error, setError] = useState('');

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
        <Container className="mt-5 pt-5">
            <Row>
                {/* Cột bên trái - Ảnh bãi biển */}
                <Col xs={12} md={6} className="mb-4">
                    <Card className="shadow">
                        <Card.Img 
                            variant="top" 
                            src={beach.image_url} 
                            alt={beach.name}
                            className="img-fluid"
                            style={{ 
                                maxHeight: '500px', 
                                objectFit: 'cover' // Đảm bảo ảnh không bị méo
                            }}
                        />
                    </Card>
                </Col>
                
                {/* Cột bên phải - Thông tin bãi biển */}
                <Col xs={12} md={6} className="text-start">
                    {/* Tiêu đề bãi biển */}
                    <h1 className="display-4 fw-bold text-primary mb-3">
                        {beach.name}
                    </h1>
                    
                    {/* Region ID */}
                    <p className="text-muted mb-4">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        Region ID: {beach.region_id}
                    </p>
                    
                    {/* Mô tả HTML đầy đủ */}
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-3">
                                <i className="fas fa-info-circle me-2 text-info"></i>
                                Mô tả chi tiết
                            </Card.Title>
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
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BeachDetail;
