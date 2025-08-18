import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button } from "react-bootstrap";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../util/url";
import "../common/ImageGallery.css";

const Gallery = () => {
  const [searchParams] = useSearchParams();
  const beachId = searchParams.get('beach_id');
  
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
    
    let filteredGroups = Array.from(groups.entries()).map(([beachId, items]) => ({
      beachId,
      beachName: beachIdToName.get(beachId) || `Beach #${beachId}`,
      images: items
        .filter(it => !!it.image_url)
        .map(it => ({ id: it.id, url: it.image_url, caption: stripHtml(it.caption || "") })),
    })).filter(g => g.images.length > 0);
    
    // Filter by beach_id if provided
    if (beachId) {
      filteredGroups = filteredGroups.filter(group => group.beachId === beachId);
    }
    
    return filteredGroups;
  }, [galleries, beachIdToName, beachId]);

  const openLightbox = (group, startIndex = 0) => {
    setLightboxImages(group.images);
    setLightboxIndex(startIndex);
    setLightboxTitle(group.beachName);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };
  const showPrev = () => {
    const newIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    setLightboxIndex(newIndex);
  };
  
  const showNext = () => {
    const newIndex = (lightboxIndex + 1) % lightboxImages.length;
    setLightboxIndex(newIndex);
  };





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
        {/* Breadcrumb for filtered view */}
        {beachId && groupedByBeach.length > 0 && (
          <div className="mb-4">
            <Link to={`/beach/${beachId}`} className="text-decoration-none">
              <Button variant="outline-primary" size="sm">
                <i className="fas fa-arrow-left me-2"></i>
                Back to {groupedByBeach[0].beachName}
              </Button>
            </Link>
          </div>
        )}
        
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-2">
            {beachId && groupedByBeach.length > 0 
              ? `${groupedByBeach[0].beachName} - Photo Gallery`
              : "Photo Gallery"
            }
          </h1>
          <p className="lead text-muted mb-0">
            {beachId && groupedByBeach.length > 0
              ? `Explore stunning photos of ${groupedByBeach[0].beachName}`
              : "Explore stunning beach photography from our community"
            }
          </p>
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
          <>
            {/* Show message if no images found for specific beach */}
            {beachId && groupedByBeach.length === 0 && (
              <Alert variant="info" className="text-center">
                <i className="fas fa-info-circle me-2"></i>
                No photos found for this beach. 
                <Link to="/gallery" className="ms-2">View all galleries</Link>
              </Alert>
            )}
            
            {/* Show all images for specific beach in grid layout */}
            {beachId && groupedByBeach.length > 0 && (
              <Row xs={1} md={2} lg={3} className="g-4">
                {groupedByBeach[0].images.map((image, index) => (
                  <Col key={image.id}>
                    <Card className="h-100 shadow-sm" role="button" onClick={() => openLightbox(groupedByBeach[0], index)}>
                      <Card.Img
                        variant="top"
                        src={image.url}
                        alt={`${groupedByBeach[0].beachName} - Image ${index + 1}`}
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                      <Card.Body>
                        <Card.Title className="fw-bold d-flex align-items-center justify-content-between">
                          <span>Image {index + 1}</span>
                          <Badge bg="secondary">{groupedByBeach[0].images.length}</Badge>
                        </Card.Title>
                        {image.caption && (
                          <Card.Text className="text-muted small">{image.caption}</Card.Text>
                        )}
                        <Card.Text className="text-muted">Click to view</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
            
            {/* Show all beaches when no beach_id filter */}
            {!beachId && (
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
          </>
        )}

                 {isLightboxOpen && (
           <div 
             className="lightbox-overlay" 
             onClick={closeLightbox}
             style={{
               position: 'fixed',
               top: 0,
               left: 0,
               width: '100vw',
               height: '100vh',
               background: 'rgba(0,0,0,0.9)',
               zIndex: 9999,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               cursor: 'pointer'
             }}
           >
             <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
               <div className="lightbox-stage">
                 <img
                   src={lightboxImages[lightboxIndex]?.url}
                   alt={lightboxTitle}
                   className="lightbox-img"
                 />
               </div>
                               <button 
                  className="lightbox-close" 
                  onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    fontSize: '30px',
                    color: 'white',
                    cursor: 'pointer',
                    zIndex: 10000,
                    background: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0,0,0,1)';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(0,0,0,0.8)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  &times;
                </button>
                
                
               <button 
                 type="button" 
                 className="lightbox-prev" 
                 onClick={(e) => {
                   e.stopPropagation();
                   showPrev();
                 }} 
                 aria-label="Previous image"
               >
                 &#10094;
               </button>
               <button 
                 type="button" 
                 className="lightbox-next" 
                 onClick={(e) => {
                   e.stopPropagation();
                   showNext();
                 }} 
                 aria-label="Next image"
               >
                 &#10095;
               </button>
               <div className="lightbox-caption">
                 <div className="fw-semibold mb-1">{lightboxTitle}</div>
                 {lightboxImages[lightboxIndex]?.caption && (
                   <div className="small">{lightboxImages[lightboxIndex]?.caption}</div>
                 )}
                 <div className="text-white-50 small mt-1">{lightboxIndex + 1} / {lightboxImages.length}</div>
               </div>
             </div>
           </div>
         )}
      </Container>
    </div>
  );
};

export default Gallery;
