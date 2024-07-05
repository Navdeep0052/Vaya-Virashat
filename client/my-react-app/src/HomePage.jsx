import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';
import './HomePage.css'; // You can create this CSS file for styling

const apiurl = import.meta.env.VITE_BASE_API_URL;

function HomePage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`${apiurl}/hotels`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch hotels');
        }

        const data = await response.json();
        setHotels(data.hotels);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred while fetching hotels. Please try again.');
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleViewDetails = (hotelId) => {
    navigate(`/HotelDetails/${hotelId}`);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container fluid className="homepage-container">
      <Row>
        <Col md={3}>
        </Col>
        <Col md={9}>
          <Row>
            {hotels.length > 0 ? (
              hotels.map((hotel) => (
                <Col xs={12} sm={6} lg={4} key={hotel._id} className="mb-4">
                  <Card className="hotel-card">
                    <div style={{ height: '200px', overflow: 'hidden' }}>
                      <Card.Img
                        variant="top"
                        src={hotel.logo[0]}
                        alt={hotel.hotelName}
                        className="hotel-logo"
                        style={{ objectFit: 'cover', height: '100%' }}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title
                        className="card-title"
                        onClick={() => handleViewDetails(hotel._id)}
                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                      >
                        {hotel.hotelName}
                      </Card.Title>
                      <Card.Text>
                        <strong>Hotel Email :</strong> {hotel.hotelEmail}
                      </Card.Text>
                      <Card.Text>
                        <strong>Address :</strong> {hotel.address}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <p>No hotels registered yet.</p>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
