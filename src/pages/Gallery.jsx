import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Pagination } from 'react-bootstrap';

function Gallery() {
  const imagesPerPage = 9;
  const [activePage, setActivePage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Sample gallery data - replace with your actual images
  const galleryImages = [
    { id: 1, src: '/Gallery/1.jpeg', alt: 'Gallery Image 1' },
    { id: 2, src: '/Gallery/2.jpeg', alt: 'Gallery Image 2' },
    { id: 3, src: '/Gallery/3.jfif', alt: 'Gallery Image 3' },
    { id: 4, src: '/Gallery/4.jfif', alt: 'Gallery Image 4' },
    { id: 5, src: '/Gallery/5.jfif', alt: 'Gallery Image 5' },
    { id: 6, src: '/Gallery/6.jfif', alt: 'Gallery Image 6' },
    { id: 7, src: '/Gallery/7.jpeg', alt: 'Gallery Image 7' },
    { id: 8, src: '/Gallery/8.jfif', alt: 'Gallery Image 8' },
    { id: 9, src: '/Gallery/9.jpeg', alt: 'Gallery Image 9' },
    { id: 10, src: '/Gallery/10.jpeg', alt: 'Gallery Image 10' },
    { id: 11, src: '/Gallery/11.jpeg', alt: 'Gallery Image 11' },
    { id: 12, src: '/Gallery/12.jpeg', alt: 'Gallery Image 12' },
    { id: 13, src: '/Gallery/13.jfif', alt: 'Gallery Image 13' },
    { id: 14, src: '/Gallery/14.jfif', alt: 'Gallery Image 14' },
    { id: 15, src: '/Gallery/15.jpeg', alt: 'Gallery Image 15' },
    { id: 15, src: '/Gallery/16.jpeg', alt: 'Gallery Image 15' },
  ];

  const totalPages = Math.ceil(galleryImages.length / imagesPerPage);
  const currentImages = galleryImages.slice(
    (activePage - 1) * imagesPerPage,
    activePage * imagesPerPage
  );

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setAnimationKey(prevKey => prevKey + 1);
  };

  const observerCallback = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        entry.target.style.visibility = 'visible';
      }
    });
  }, []);

  useEffect(() => {
    setIsLoaded(true);

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => {
      el.style.visibility = 'hidden';
      observer.observe(el);
    });

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, [observerCallback, animationKey]);

  return (
    <>
      <style>
        {`
          :root {
            --animation-duration: 0.8s;
            --animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
          }

          .hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity var(--animation-duration) var(--animation-timing-function),
                        transform var(--animation-duration) var(--animation-timing-function);
          }

          .show {
            opacity: 1;
            transform: translateY(0);
          }

          .fade-in {
            animation: fadeIn var(--animation-duration) var(--animation-timing-function) forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .hover-card {
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          }

          .hover-card:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>

      <div
        className={`${isLoaded ? 'fade-in' : ''}`}
        style={{
          backgroundImage: 'url(/images/banner-without-content.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '100px 0',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: 'white', margin: 0 }}>Gallery</h1>
      </div>

      <Container className="my-5">
        <Row className="g-4" key={animationKey}>
          {currentImages.map((image, index) => (
            <Col key={image.id} sm={6} md={4} lg={4} className="hidden" style={{transitionDelay: `${index * 0.1}s`}}>
              <Card className="border-0 shadow-sm h-100 hover-card">
                <Card.Img
                  variant="top"
                  src={image.src}
                  alt={image.alt}
                  style={{ height: '300px', width: 'auto', objectFit: 'cover' }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(Math.max(activePage - 1, 1))}
              disabled={activePage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={activePage === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(Math.min(activePage + 1, totalPages))}
              disabled={activePage === totalPages}
            />
          </Pagination>
        </div>
      </Container>
    </>
  );
}

export default Gallery;

