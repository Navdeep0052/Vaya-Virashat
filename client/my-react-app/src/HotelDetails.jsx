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
    } catch (error) {
      console.error('Error fetching hotel data:', error);
      toast.error('Failed to fetch hotel data');
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
      default:
        return null;
    }
  };

  if (!hotelData) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <>
      <div className="container my-5">
        <ToastContainer />
        <h2 className="text-center mb-4">{hotelData.hotelName}</h2>
        <ul className="nav nav-tabs justify-content-center mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>General</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'facilities' ? 'active' : ''}`} onClick={() => setActiveTab('facilities')}>Facilities</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'owner' ? 'active' : ''}`} onClick={() => setActiveTab('owner')}>Owner</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}>Media</button>
          </li>
        </ul>
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};

export default HotelDetails;
