import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Badge, Spinner, Alert } from "react-bootstrap";
import { API_BASE_URL } from "../../util/url";
import "../common/ImageGallery.css";

const Gallery = () => {
  const [beaches, setBeaches] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState("");

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [beachesRes, galleriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/beaches.php`),
          fetch(`${API_BASE_URL}/galleries.php`),
        ]);
        const beachesJson = await beachesRes.json();
        const galleriesJson = await galleriesRes.json();

        if (!beachesJson.status) throw new Error(beachesJson.message || "Failed to load beaches");
        if (!galleriesJson.status) throw new Error(galleriesJson.message || "Failed to load galleries");

        setBeaches(beachesJson.data || []);
        setGalleries(galleriesJson.data || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const beachIdToName = useMemo(() => {
    const map = new Map();
    beaches.forEach(b => map.set(String(b.id), b.name));
    return map;
  }, [beaches]);

  const groupedByBeach = useMemo(() => {
    const groups = new Map();
    galleries.forEach(g => {
      const key = String(g.beach_id || "");
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(g);
    });
    return Array.from(groups.entries()).map(([beachId, items]) => ({
      beachId,
      beachName: beachIdToName.get(beachId) || `Beach #${beachId}`,
             images: items
         .filter(it => !!it.image_url)
         .map(it => ({ id: it.id, url: it.image_url, caption: stripHtml(it.caption || "") })),
    })).filter(g => g.images.length > 0);
  }, [galleries, beachIdToName]);

  const openLightbox = (group, startIndex = 0) => {
    setLightboxImages(group.images);
    setLightboxIndex(startIndex);
    setLightboxTitle(group.beachName);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);
  const showPrev = () => setLightboxIndex(idx => (idx - 1 + lightboxImages.length) % lightboxImages.length);
  const showNext = () => setLightboxIndex(idx => (idx + 1) % lightboxImages.length);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isLightboxOpen, lightboxImages.length]);

  return (
    <div className="gallery-page">
      <Container className="mt-5 pt-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-2">Photo Gallery</h1>
          <p className="lead text-muted mb-0">Explore stunning beach photography from our community</p>
        </div>

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" />
            <div className="mt-3">Loading galleries...</div>
          </div>
        )}

        {!loading && error && (
          <Alert variant="danger" className="text-center">{error}</Alert>
        )}

        {!loading && !error && (
          <Row xs={1} md={2} lg={3} className="g-4">
            {groupedByBeach.map((group) => (
              <Col key={group.beachId}>
                <Card className="h-100 shadow-sm" role="button" onClick={() => openLightbox(group, 0)}>
                  <Card.Img
                    variant="top"
                    src={group.images[0]?.url}
                    alt={group.beachName}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="fw-bold d-flex align-items-center justify-content-between">
                      <span>{group.beachName}</span>
                      <Badge bg="secondary">{group.images.length}</Badge>
                    </Card.Title>
                    <Card.Text className="text-muted">Click to view all photos</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {isLightboxOpen && (
          <div className="lightbox-overlay" onClick={closeLightbox}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={lightboxImages[lightboxIndex]?.url}
                alt={lightboxTitle}
                className="lightbox-img"
              />
              <span className="lightbox-close" onClick={closeLightbox}>&times;</span>
              <button type="button" className="lightbox-prev" onClick={showPrev} aria-label="Previous image">&#10094;</button>
              <button type="button" className="lightbox-next" onClick={showNext} aria-label="Next image">&#10095;</button>
              <div className="lightbox-caption text-center mt-2">
                <div className="fw-semibold">{lightboxTitle}</div>
                {lightboxImages[lightboxIndex]?.caption && (
                  <div className="text-white-50 small">{lightboxImages[lightboxIndex]?.caption}</div>
                )}
                <div className="text-white-50 small">{lightboxIndex + 1} / {lightboxImages.length}</div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Gallery;
