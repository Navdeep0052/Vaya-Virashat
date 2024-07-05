import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HotelDetails.css';
import Sidebar from './Sidebar';

const apiurl = import.meta.env.VITE_BASE_API_URL;

const HotelDetails = () => {
  const { hotelId } = useParams();
  const [hotelData, setHotelData] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchHotelData();
  }, [hotelId]);

  const fetchHotelData = async () => {
    try {
      const response = await fetch(`${apiurl}/hotels/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hotel data');
      }

      const data = await response.json();
      setHotelData(data.hotel);

      // Fetch nearby places
      const nearbyResponse = await fetch(`http://localhost:8000/getNearByPlaces?locality=${data.hotel.locality}&city=${data.hotel.city}&state=${data.hotel.state}`);
      if (!nearbyResponse.ok) {
        throw new Error('Failed to fetch nearby places');
      }

      const nearbyData = await nearbyResponse.json();
      setNearbyPlaces(nearbyData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <>
            <div className="detail-item">
              <strong>Logo:</strong>
              {hotelData.logo && (
                <div className="preview-logo">
                  <img src={hotelData.logo} alt="Hotel Logo" className="img-fluid" />
                </div>
              )}
            </div>
            <div className="detail-item">
              <strong>Email:</strong> {hotelData.hotelEmail}
            </div>
            <div className="detail-item">
              <strong>Contact Details:</strong> {hotelData.contactDetails}
            </div>
            <div className="detail-item">
              <strong>Address:</strong> {hotelData.address}
            </div>
            <div className="detail-item">
              <strong>Website:</strong> <a href={hotelData.link} target="_blank" rel="noopener noreferrer">{hotelData.link}</a>
            </div>
            <div className="detail-item">
              <strong>Description:</strong> {hotelData.description}
            </div>
            <div className="detail-item">
              <strong>Registration Number:</strong> {hotelData.confirmRegNumber}
            </div>
            <div className="detail-item">
              <strong>Area:</strong> {hotelData.area}
            </div>
            <div className="detail-item">
              <strong>Star Rating:</strong> {hotelData.hotelStar}
            </div>
            <div className="detail-item">
              <strong>Days Availability:</strong> {hotelData.daysAvailiblity}
            </div>
            <div className="detail-item">
              <strong>Available All Days:</strong> {hotelData.alldaysAvailable ? 'Yes' : 'No'}
            </div>
            <div className="detail-item">
              <strong>Operating Hours:</strong> {hotelData.from} - {hotelData.to}
            </div>
          </>
        );
      case 'facilities':
        return (
          <>
            <div className="detail-item">
              <strong>CCTV Cameras:</strong> {hotelData.cameras ? 'Yes' : 'No'}
            </div>
            <div className="detail-item">
              <strong>Wi-Fi:</strong> {hotelData.wifi ? 'Yes' : 'No'}
            </div>
          </>
        );
      case 'owner':
        return (
          <>
            <div className="detail-item">
              <strong>Owner Adhaar Card Number:</strong> {hotelData.ownerAdhaarCardNo}
            </div>
            <div className="detail-item">
              <strong>Owner Adhar Card:</strong>
              {hotelData.ownerAdhaarCard && (
                <div className="preview-document">
                  <img src={hotelData.ownerAdhaarCard} alt="Adhar Card" className="img-fluid" />
                </div>
              )}
            </div>
            <div className="detail-item">
              <strong>Owner PAN Card Number:</strong> {hotelData.ownerPanCardNo}
            </div>
            <div className="detail-item">
              <strong>Owner Pan Card:</strong>
              {hotelData.ownerPanCard && (
                <div className="preview-document">
                  <img src={hotelData.ownerPanCard} alt="Pan Card" className="img-fluid" />
                </div>
              )}
            </div>
            <div className="detail-item">
              <strong>Electricity Bill:</strong>
              {hotelData.electricityBill && (
                <div className="preview-document">
                  <img src={hotelData.electricityBill} alt="Electricity Bill" className="img-fluid" />
                </div>
              )}
            </div>
            <div className="detail-item">
              <strong>Agreement Papers:</strong>
              {hotelData.aggrementPapers && (
                <div className="preview-document">
                  <img src={hotelData.aggrementPapers} alt="Agreement Papers" className="img-fluid" />
                </div>
              )}
            </div>
            <div className="detail-item">
              <strong>Property Papers:</strong>
              {hotelData.propertyPapers && (
                <div className="preview-document">
                  <img src={hotelData.propertyPapers} alt="Property Papers" className="img-fluid" />
                </div>
              )}
            </div>
          </>
        );
      case 'media':
        return (
          <>
            <div className="detail-item">
              <strong>Images:</strong>
              {hotelData.images && hotelData.images.length > 0 && (
                <div className="preview-images">
                  {hotelData.images.map((image, index) => (
                    <img key={index} src={image} alt={`Hotel Image ${index + 1}`} className="img-fluid" />
                  ))}
                </div>
              )}
            </div>
            <div className="detail-item">
              <strong>Videos:</strong>
              {hotelData.videos && hotelData.videos.length > 0 && (
                <div className="preview-videos">
                  {hotelData.videos.map((video, index) => (
                    <video key={index} controls className="img-fluid">
                      <source src={video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ))}
                </div>
              )}
            </div>
            <div className="detail-item">
              <strong>Map:</strong> <a href={hotelData.map} target="_blank" rel="noopener noreferrer">{hotelData.map}</a>
            </div>
          </>
        );
      case 'nearby':
        return (
          <>
            <div className="detail-item">
              <strong>Location:</strong>
              <div>{nearbyPlaces.searchedLocation.locality}, {nearbyPlaces.searchedLocation.city}, {nearbyPlaces.searchedLocation.state}</div>
              <iframe
                src={nearbyPlaces.searchedLocation.embeddedMapUrl}
                title="Map"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="detail-item">
              <strong>Highlights:</strong>
              {nearbyPlaces.highlights.map((place, index) => (
                <div key={index}>
                  <div>{place.name}</div>
                  <div>{place.address}</div>
                  <div>Distance: {place.distance}</div>
                  <div>Duration: {place.duration}</div>
                  <div><a href={place.mapUrl} target="_blank" rel="noopener noreferrer">View on Map</a></div>
                </div>
              ))}
            </div>
            <div className="detail-item">
              <strong>Shopping Malls:</strong>
              {nearbyPlaces.shoppingMalls.map((mall, index) => (
                <div key={index}>
                  <div>{mall.name}</div>
                  <div>{mall.address}</div>
                  <div>Distance: {mall.distance}</div>
                  <div>Duration: {mall.duration}</div>
                  <div><a href={mall.mapUrl} target="_blank" rel="noopener noreferrer">View on Map</a></div>
                </div>
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (!hotelData) {
    return <div className="text-center my-5">Loading hotel details...</div>;
  }

  return (
    <div className="container">
      <ToastContainer />
      <div className="row mt-4">
        <div className="col-md-3">
          <Sidebar />
        </div>
        <div className="col-md-9">
          <h1 className="text-center mb-4">{hotelData.hotelName}</h1>
          <div className="tabs">
            <button className={`tab-button ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>General</button>
            <button className={`tab-button ${activeTab === 'facilities' ? 'active' : ''}`} onClick={() => setActiveTab('facilities')}>Facilities</button>
            <button className={`tab-button ${activeTab === 'owner' ? 'active' : ''}`} onClick={() => setActiveTab('owner')}>Owner</button>
            <button className={`tab-button ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}>Media</button>
            <button className={`tab-button ${activeTab === 'nearby' ? 'active' : ''}`} onClick={() => setActiveTab('nearby')}>Nearby Places</button>
          </div>
          <div className="tab-content">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
