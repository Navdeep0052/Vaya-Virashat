import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import Sidebar from "./Sidebar"; // Import your Sidebar component
import "./HotelList.css";

const apiurl = import.meta.env.VITE_BASE_API_URL;

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

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
        toast.error("An error occurred while fetching hotels. Please try again.");
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

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
          <Sidebar /> {/* Include your Sidebar component */}
        </Col>
        <Col md={9}>
          {hotels.length > 0 ? (
            <Row>
              {hotels.map((hotel) => (
                <Col xs={12} key={hotel._id} className="mb-4">
                  <Card className="hotel-card">
                    <Row className="align-items-center">
                      <Col xs={12} md={4}>
                        <Card.Img
                          variant="top"
                          src={hotel.logo}
                          alt={hotel.hotelName}
                          className="hotel-logo"
                        />
                      </Col>
                      <Col xs={12} md={8}>
                        <Card.Body>
                          <Card.Title>{hotel.hotelName}</Card.Title>
                          <Card.Text>Hotel Email: {hotel.hotelEmail}</Card.Text>
                          <Card.Text>Contact Details: {hotel.contactDetails}</Card.Text>
                          <Card.Text>Address: {hotel.address}</Card.Text>
                          <Card.Text>
                            Hotel Website:{" "}
                            <a
                              href={hotel.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {hotel.link}
                            </a>
                          </Card.Text>
                          <Card.Text>Description: {hotel.description}</Card.Text>
                          <Card.Text>Rating: {hotel.hotelStar}</Card.Text>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p>No hotels registered yet.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default HotelList;
