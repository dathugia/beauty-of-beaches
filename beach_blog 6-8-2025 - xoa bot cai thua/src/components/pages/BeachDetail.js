import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { API_BASE_URL } from "../../util/url";

const BeachDetail = () => {
    const { id } = useParams();
    const [beach, setBeach] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getBeachDetail = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/beach.php?id=${id}`);
            const json = await response.json();
            
            if (json.status) {
                setBeach(json.data);
            } else {
                setError(json.message || 'Không tìm thấy bãi biển');
            }
        } catch (e) {
            setError('Lỗi kết nối: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBeachDetail();
    }, [id]);

    if (loading) return <div className="text-center p-5">Đang tải thông tin bãi biển...</div>;
    if (error) return <div className="text-center p-5 text-danger">Lỗi: {error}</div>;

    return (
        <Container className="mt-5 pt-5">
            <Row>
                <Col xs={12} md={6}>
                    <img 
                        src={beach.image_url} 
                        alt={beach.name}
                        className="w-100 img-thumbnail"
                        style={{ maxHeight: '500px', objectFit: 'cover' }}
                    />
                </Col>
                <Col xs={12} md={6} className="text-start">
                    <h1 className="mb-3">{beach.name}</h1>
                    <p className="text-muted mb-4">Region ID: {beach.region_id}</p>
                    
                    <div 
                        className="beach-description"
                        dangerouslySetInnerHTML={{ __html: beach.description || '' }}
                        style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                            maxHeight: '600px',
                            overflowY: 'auto'
                        }}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default BeachDetail;
