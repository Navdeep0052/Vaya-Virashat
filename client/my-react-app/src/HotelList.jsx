import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ShortlistHotel from './ShortlistHotel'; // Import the ShortlistHotel component
import './HotelList.css';

const apiurl = import.meta.env.VITE_BASE_API_URL;

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditDelete, setShowEditDelete] = useState(true); // Default to show edit/delete options
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(apiurl + '/listing', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch hotels');
        }

        const data = await response.json();
        setHotels(data.hotel);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred while fetching hotels. Please try again.');
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleDelete = async (hotelId) => {
    try {
      const response = await fetch(`${apiurl}/deleteHotel/${hotelId}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });

      if (response.ok) {
        setHotels((prevHotels) => prevHotels.filter((hotel) => hotel._id !== hotelId));
        toast.success('Hotel deleted successfully!');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Deletion failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleEdit = (hotelId) => {
    navigate(`/edit-hotel/${hotelId}`);
  };

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
    <Container fluid className="hotel-list-container">
      <Row>
        <Col md={3}>
          <Sidebar />
        </Col>
        <Col md={9}>
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <Row key={hotel._id} className="mb-4">
                <Col xs={12} sm={6} lg={4}>
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
                      <ShortlistHotel hotelId={hotel._id} /> {/* Add the ShortlistHotel component */}
                      {showEditDelete && ( // Conditionally render edit and delete buttons
                        <>
                          <Button
                            variant="outline-primary"
                            onClick={() => handleEdit(hotel._id)}
                            className="edit-button me-2"
                          >
                            <FaEdit /> Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(hotel._id)}
                            className="delete-button"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            ))
          ) : (
            <Col xs={12}>
              <p>No hotels registered yet.</p>
            </Col>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default HotelList;
