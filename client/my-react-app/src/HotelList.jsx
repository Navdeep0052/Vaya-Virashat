import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./HotelList.css";

const apiurl = import.meta.env.VITE_BASE_API_URL;

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(apiurl + "/listing", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch hotels");
        }

        const data = await response.json();
        setHotels(data.hotel);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(
          "An error occurred while fetching hotels. Please try again."
        );
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleDelete = async (hotelId) => {
    try {
      const response = await fetch(`${apiurl}/deleteHotel/${hotelId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.ok) {
        setHotels((prevHotels) =>
          prevHotels.filter((hotel) => hotel._id !== hotelId)
        );
        toast.success("Hotel deleted successfully!");
      } else {
        const data = await response.json();
        toast.error(data.error || "Deletion failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
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
                <Col xs={3}>
                  <Card className="hotel-card">
                    <Card.Img
                      variant="top"
                      src={hotel.logo}
                      alt={hotel.hotelName}
                      className="hotel-logo"
                    />
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card className="hotel-card">
                    <Card.Body>
                      <Card.Title
                        className="card-title"
                        onClick={() => handleViewDetails(hotel._id)}
                        style={{
                          cursor: "pointer",
                          color: "blue",
                          textDecoration: "underline",
                        }}
                      >
                        {hotel.hotelName}
                      </Card.Title>
                      <Card.Text>
                        <strong>Hotel Email :</strong> {hotel.hotelEmail}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={3} className="d-flex align-items-center justify-content-end">
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
                </Col>
              </Row>
            ))
          ) : (
            <p>No hotels registered yet.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default HotelList;
