import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const Gallery = () => {
  // Sample gallery images - bạn có thể thay thế bằng dữ liệu thực
  const galleryImages = [
    {
      id: 1,
      title: "Cala Goloritze, Italy",
      image: "https://worlds50beaches.com/assets/images/world-2025/011.webp",
      description: "Mystical beach amphitheatre with dramatic limestone pinnacle"
    },
    {
      id: 2,
      title: "Entalula Beach, Philippines",
      image: "https://worlds50beaches.com/assets/images/world-2025/021.webp",
      description: "Pristine tropical paradise with crystal clear waters"
    },
    {
      id: 3,
      title: "Bang Bao Beach, Thailand",
      image: "https://worlds50beaches.com/assets/images/world-2025/031.webp",
      description: "Beautiful coastal scenery with golden sands"
    },
    {
      id: 4,
      title: "Fteri Beach, Greece",
      image: "https://worlds50beaches.com/assets/images/world-2025/041.webp",
      description: "Mediterranean beauty with turquoise waters"
    },
    {
      id: 5,
      title: "PK 9 Beach, French Polynesia",
      image: "https://worlds50beaches.com/assets/images/world-2025/051.webp",
      description: "Exotic island paradise in the South Pacific"
    },
    {
      id: 6,
      title: "Canto de la Playa, Dominican Republic",
      image: "https://worlds50beaches.com/assets/images/world-2025/061.webp",
      description: "Caribbean charm with pristine white sands"
    }
  ];

  return (
    <div className="gallery-page">
      <Container className="mt-5 pt-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-4">Photo Gallery</h1>
          <p className="lead text-muted">
            Explore stunning beach photography from around the world
          </p>
        </div>

        <Row xs={1} md={2} lg={3} className="g-4">
          {galleryImages.map((item) => (
            <Col key={item.id}>
              <Card className="h-100 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={item.image} 
                  alt={item.title}
                  style={{ 
                    height: '250px', 
                    objectFit: 'cover' 
                  }}
                />
                <Card.Body>
                  <Card.Title className="fw-bold">{item.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {item.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Gallery;
