import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';
import ShortlistHotel from './ShortlistHotel'; // Import the ShortlistHotel component
import ChatBox from './ChatBox'; // Import the ChatBox component
import './HotelCards.css';
import { FaEdit, FaTrash, FaComments } from 'react-icons/fa'; // Import chat icon

const apiurl = import.meta.env.VITE_BASE_API_URL;

function HomePage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditDelete, setShowEditDelete] = useState(false); // Track if "All Hotels" is clicked
  const [activeChat, setActiveChat] = useState(null); // State to manage active chat
  const [chatOwnerId, setChatOwnerId] = useState(null); // State to store ownerId for chat
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

  const handleEdit = (hotelId) => {
    navigate(`/edit-hotel/${hotelId}`);
  };

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

  const handleChatClick = async (hotelId) => {
    const hotel = hotels.find((hotel) => hotel._id === hotelId);
    if (hotel) {
      setChatOwnerId(hotel.ownerId);
      setActiveChat(hotelId);
    } else {
      toast.error('Hotel not found');
    }
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
          <Sidebar onAllHotelsClick={() => setShowEditDelete(true)} /> {/* Pass the handler */}
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
                      <ShortlistHotel hotelId={hotel._id} /> {/* Add the ShortlistHotel component */}
                      <Button
                        variant="outline-primary"
                        onClick={() => handleChatClick(hotel._id)}
                        className="chat-button me-2"
                      >
                        <FaComments /> Chat
                      </Button>
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
                            <FaTrash /> Delete
                          </Button>
                        </>
                      )}
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
      {activeChat && chatOwnerId && <ChatBox hotelId={activeChat} ownerId={chatOwnerId} onClose={() => setActiveChat(null)} />}
    </Container>
  );
}

export default HomePage;
