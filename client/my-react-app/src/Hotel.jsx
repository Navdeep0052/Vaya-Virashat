// import React, { useState, useEffect } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate, useParams } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
// import './Hotel.css';

// const apiurl = import.meta.env.VITE_BASE_API_URL;

// function RegisterHotel() {
//   const { hotelId } = useParams();
//   const navigate = useNavigate();

//   const [isEditMode, setIsEditMode] = useState(false);
//   const [hotelData, setHotelData] = useState({
//     hotelName: '',
//     hotelEmail: '',
//     contactDetails: '',
//     address: '',
//     link: '',
//     logo: '',
//     images: [],
//     videos: [],
//     map: '',
//     description: '',
//     confirmRegNumber: '',
//     area: '',
//     hotelStar: '',
//     propertyPapers: [],
//     agreementPapers: [],
//     electricityBill: [],
//     cameras: false,
//     wifi: false,
//     ownerAdhaarCard: [],
//     ownerAdhaarCardNo: '',
//     ownerPanCard: [],
//     ownerPanCardNo: '',
//   });

//   useEffect(() => {
//     if (hotelId) {
//       setIsEditMode(true);
//       fetchHotelData();
//     }
//   }, [hotelId]);

//   const fetchHotelData = async () => {
//     try {
//       const response = await fetch(`${apiurl}/hotels/${hotelId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch hotel data');
//       }

//       const data = await response.json();
//       const hotel = data.hotel;
//       setHotelData({
//         hotelName: hotel.hotelName || '',
//         hotelEmail: hotel.hotelEmail || '',
//         contactDetails: hotel.contactDetails || '',
//         address: hotel.address || '',
//         link: hotel.link || '',
//         logo: hotel.logo || '',
//         images: hotel.images || [],
//         videos: hotel.videos || [],
//         map: hotel.map || '',
//         description: hotel.description || '',
//         confirmRegNumber: hotel.confirmRegNumber || '',
//         area: hotel.area || '',
//         hotelStar: hotel.hotelStar || '',
//         propertyPapers: hotel.propertyPapers || [],
//         agreementPapers: hotel.agreementPapers || [],
//         electricityBill: hotel.electricityBill || [],
//         cameras: hotel.cameras || false,
//         wifi: hotel.wifi || false,
//         ownerAdhaarCard: hotel.ownerAdhaarCard || [],
//         ownerAdhaarCardNo: hotel.ownerAdhaarCardNo || '',
//         ownerPanCard: hotel.ownerPanCard || [],
//         ownerPanCardNo: hotel.ownerPanCardNo || '',
//       });
//     } catch (error) {
//       console.error('Error fetching hotel data:', error);
//       toast.error('Failed to fetch hotel data');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setHotelData((prevData) => ({
//       ...prevData,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleFileChange = async (e) => {
//     const { name, files } = e.target;
//     const uploadedFiles = await uploadFiles(files);
//     setHotelData((prevData) => ({
//       ...prevData,
//       [name]: uploadedFiles[0]?.Location || '',
//     }));
//   };

//   const handleMultiFileChange = async (e) => {
//     const { name, files } = e.target;
//     const uploadedFiles = await uploadFiles(files);
//     setHotelData((prevData) => ({
//       ...prevData,
//       [name]: uploadedFiles.map((file) => file.Location),
//     }));
//   };

//   const uploadFiles = async (files) => {
//     const formData = new FormData();
//     for (let i = 0; i < files.length; i++) {
//       formData.append('files', files[i]);
//     }

//     try {
//       const response = await fetch(`${apiurl}/upload`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to upload files');
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       toast.error('File upload failed. Please try again.');
//       return [];
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       let url = `${apiurl}/register`;
//       let method = 'POST';

//       if (isEditMode) {
//         url = `${apiurl}/editHotel/${hotelId}`;
//         method = 'PUT';
//       }

//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(hotelData),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         const message = isEditMode ? 'Hotel updated successfully!' : (data.message || 'Hotel registered successfully!');
//         toast.success(message);
//         navigate('/hotel-list');
//       } else {
//         const errorMessage = isEditMode ? 'Hotel update failed. Please try again.' : (data.error || 'Registration failed. Please try again.');
//         toast.error(errorMessage);
//       }
//     } catch (error) {
//       toast.error('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="register-hotel-container">
//       <ToastContainer />
//       <form className="register-hotel-form" onSubmit={handleSubmit}>
//         <h2>{isEditMode ? 'Edit Hotel' : 'Register Hotel'}</h2>
//         <div className="form-group">
//           <input
//             type="text"
//             name="hotelName"
//             value={hotelData.hotelName}
//             onChange={handleChange}
//             placeholder="Hotel Name"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="email"
//             name="hotelEmail"
//             value={hotelData.hotelEmail}
//             onChange={handleChange}
//             placeholder="Hotel Email"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="tel"
//             name="contactDetails"
//             value={hotelData.contactDetails}
//             onChange={handleChange}
//             placeholder="Contact Details"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="text"
//             name="address"
//             value={hotelData.address}
//             onChange={handleChange}
//             placeholder="Address"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="url"
//             name="link"
//             value={hotelData.link}
//             onChange={handleChange}
//             placeholder="Website Link"
//           />
//         </div>
//         <div className="form-group">
//           <label>Hotel Logo</label>
//           <input
//             type="file"
//             name="logo"
//             onChange={handleFileChange}
//             placeholder="Upload Hotel Logo"
//           />
//         </div>
//         <div className="form-group">
//           <label>Hotel Images</label>
//           <input
//             type="file"
//             name="images"
//             multiple
//             onChange={handleMultiFileChange}
//           />
//         </div>
//         <div className="form-group">
//           <label>Hotel Videos</label>
//           <input
//             type="file"
//             name="videos"
//             multiple
//             onChange={handleMultiFileChange}
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="url"
//             name="map"
//             value={hotelData.map}
//             onChange={handleChange}
//             placeholder="Map Link"
//           />
//         </div>
//         <div className="form-group">
//           <textarea
//             name="description"
//             value={hotelData.description}
//             onChange={handleChange}
//             placeholder="Description"
//           ></textarea>
//         </div>
//         <div className="form-group">
//           <input
//             type="text"
//             name="confirmRegNumber"
//             value={hotelData.confirmRegNumber}
//             onChange={handleChange}
//             placeholder="Registration Number"
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="text"
//             name="area"
//             value={hotelData.area}
//             onChange={handleChange}
//             placeholder="Area (sqft)"
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="number"
//             name="hotelStar"
//             value={hotelData.hotelStar}
//             onChange={handleChange}
//             placeholder="Hotel Star Rating"
//           />
//         </div>
//         <div className="form-group">
//         <label>Hotel Papers</label>
//           <input
//             type="file"
//             name="propertyPapers"
//             multiple
//             onChange={handleMultiFileChange}
//           />
//         </div>
//         <div className="form-group">
//         <label>Hotel Aggrement Papers</label>
//           <input
//             type="file"
//             name="agreementPapers"
//             multiple
//             onChange={handleMultiFileChange}
//           />
//         </div>
//         <div className="form-group">
//         <label>Hotel Electricity Bill</label>
//           <input
//             type="file"
//             name="electricityBill"
//             multiple
//             onChange={handleMultiFileChange}
//           />
//         </div>
//         <div className="form-group">
//           <label>
//             <input
//               type="checkbox"
//               name="cameras"
//               checked={hotelData.cameras}
//               onChange={handleChange}
//             />
//             Cameras
//           </label>
//         </div>
//         <div className="form-group">
//           <label>
//             <input
//               type="checkbox"
//               name="wifi"
//               checked={hotelData.wifi}
//               onChange={handleChange}
//             />
//             WiFi
//           </label>
//         </div>
//         <div className="form-group">
//         <label>Owner Adhar Card Images</label>
//           <input
//             type="file"
//             name="ownerAdhaarCard"
//             multiple
//             onChange={handleMultiFileChange}
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="text"
//             name="ownerAdhaarCardNo"
//             value={hotelData.ownerAdhaarCardNo}
//             onChange={handleChange}
//             placeholder="Owner Aadhaar Card Number"
//           />
//         </div>
//         <div className="form-group">
//         <label>Owner Pan Card Images</label>
//           <input
//             type="file"
//             name="ownerPanCard"
//             multiple
//             onChange={handleMultiFileChange}
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="text"
//             name="ownerPanCardNo"
//             value={hotelData.ownerPanCardNo}
//             onChange={handleChange}
//             placeholder="Owner PAN Card Number"
//           />
//         </div>
//         <div className="form-group">
//           <button type="submit">{isEditMode ? 'Update Hotel' : 'Register Hotel'}</button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default RegisterHotel;

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Hotel.css';

const apiurl = import.meta.env.VITE_BASE_API_URL;

function RegisterHotel() {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [hotelData, setHotelData] = useState({
    hotelName: '',
    hotelEmail: '',
    contactDetails: '',
    address: '',
    link: '',
    logo: '',
    images: [],
    videos: [],
    map: '',
    description: '',
    confirmRegNumber: '',
    area: '',
    hotelStar: '',
    propertyPapers: [],
    agreementPapers: [],
    electricityBill: [],
    cameras: false,
    ownerAdhaarCardNo: '',
    ownerAdhaarCard: [],
    ownerPanCardNo: '',
    ownerPanCard: [],
    daysAvailiblity: 'Weekdays', // default value
    alldaysAvailable: false, // default value
    from: '',
    to: '',
  });

  useEffect(() => {
    if (hotelId) {
      setIsEditMode(true);
      fetchHotelData();
    }
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
      const hotel = data.hotel;
      setHotelData({
        hotelName: hotel.hotelName || '',
        hotelEmail: hotel.hotelEmail || '',
        contactDetails: hotel.contactDetails || '',
        address: hotel.address || '',
        link: hotel.link || '',
        logo: hotel.logo || '',
        images: hotel.images || [],
        videos: hotel.videos || [],
        map: hotel.map || '',
        description: hotel.description || '',
        confirmRegNumber: hotel.confirmRegNumber || '',
        area: hotel.area || '',
        hotelStar: hotel.hotelStar || '',
        propertyPapers: hotel.propertyPapers || [],
        agreementPapers: hotel.agreementPapers || [],
        electricityBill: hotel.electricityBill || [],
        cameras: hotel.cameras || false,
        ownerAdhaarCardNo: hotel.ownerAdhaarCardNo || '',
        ownerAdhaarCard: hotel.ownerAdhaarCard || [],
        ownerPanCardNo: hotel.ownerPanCardNo || '',
        ownerPanCard: hotel.ownerPanCard || [],
        daysAvailiblity: hotel.daysAvailiblity || 'Weekdays',
        alldaysAvailable: hotel.alldaysAvailable || false,
        from: hotel.from || '',
        to: hotel.to || '',
      });
    } catch (error) {
      console.error('Error fetching hotel data:', error);
      toast.error('Failed to fetch hotel data');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHotelData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const uploadedFiles = await uploadFiles(files);
    setHotelData((prevData) => ({
      ...prevData,
      [name]: uploadedFiles.map((file) => file.Location),
    }));
  };

  const uploadFiles = async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch(`${apiurl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload files');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      toast.error('File upload failed. Please try again.');
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let url = `${apiurl}/register`;
      let method = 'POST';

      if (isEditMode) {
        url = `${apiurl}/editHotel/${hotelId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(hotelData),
      });

      const data = await response.json();
      if (response.ok) {
        const message = isEditMode
          ? 'Hotel updated successfully!'
          : data.message || 'Hotel registered successfully!';
        toast.success(message);
        navigate('/hotel-list');
      } else {
        const errorMessage = isEditMode
          ? 'Hotel update failed. Please try again.'
          : data.error || 'Registration failed. Please try again.';
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="register-hotel-container">
      <ToastContainer />
      <form className="register-hotel-form" onSubmit={handleSubmit}>
        <h2>{isEditMode ? 'Edit Hotel' : 'Register Hotel'}</h2>
        <div className="form-group">
          <input
            type="text"
            name="hotelName"
            value={hotelData.hotelName}
            onChange={handleChange}
            placeholder="Hotel Name"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="hotelEmail"
            value={hotelData.hotelEmail}
            onChange={handleChange}
            placeholder="Hotel Email"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            name="contactDetails"
            value={hotelData.contactDetails}
            onChange={handleChange}
            placeholder="Contact Details"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="address"
            value={hotelData.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="url"
            name="link"
            value={hotelData.link}
            onChange={handleChange}
            placeholder="Website Link"
          />
        </div>
        <div className="form-group">
          <label>Hotel Logo</label>
          <input
            type="file"
            name="logo"
            onChange={handleFileChange}
            placeholder="Upload Hotel Logo"
          />
          {hotelData.logo && (
            <div className="preview-logo">
              <img src={hotelData.logo} alt="Hotel Logo" />
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Hotel Images</label>
          <input type="file" name="images" multiple onChange={handleFileChange} />
          {hotelData.images && hotelData.images.length > 0 && (
            <div className="preview-images">
              {hotelData.images.map((image, index) => (
                <img key={index} src={image} alt={`Image ${index + 1}`} />
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Hotel Videos</label>
          <input type="file" name="videos" multiple onChange={handleFileChange} />
          {hotelData.videos && hotelData.videos.length > 0 && (
            <div className="preview-videos">
              {hotelData.videos.map((video, index) => (
                <video key={index} controls>
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <input
            type="url"
            name="map"
            value={hotelData.map}
            onChange={handleChange}
            placeholder="Map Link"
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            value={hotelData.description}
            onChange={handleChange}
            placeholder="Description"
          ></textarea>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="confirmRegNumber"
            value={hotelData.confirmRegNumber}
            onChange={handleChange}
            placeholder="Registration Number"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="area"
            value={hotelData.area}
            onChange={handleChange}
            placeholder="Area (sqft)"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="hotelStar"
            value={hotelData.hotelStar}
            onChange={handleChange}
            placeholder="Hotel Star Rating"
          />
        </div>
        <div className="form-group">
          <label>Hotel Papers</label>
          <input type="file" name="propertyPapers" multiple onChange={handleFileChange} />
          {hotelData.propertyPapers && hotelData.propertyPapers.length > 0 && (
            <div className="preview-papers">
              {hotelData.propertyPapers.map((paper, index) => (
                <img key={index} src={paper} alt={`Paper ${index + 1}`} />
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Hotel Agreement Papers</label>
          <input type="file" name="agreementPapers" multiple onChange={handleFileChange} />
          {hotelData.agreementPapers && hotelData.agreementPapers.length > 0 && (
            <div className="preview-agreement-papers">
              {hotelData.agreementPapers.map((paper, index) => (
                <img key={index} src={paper} alt={`Agreement Paper ${index + 1}`} />
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Electricity Bill</label>
          <input type="file" name="electricityBill" multiple onChange={handleFileChange} />
          {hotelData.electricityBill && hotelData.electricityBill.length > 0 && (
            <div className="preview-electricity-bill">
              {hotelData.electricityBill.map((bill, index) => (
                <img key={index} src={bill} alt={`Electricity Bill ${index + 1}`} />
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <input
            type="checkbox"
            name="cameras"
            checked={hotelData.cameras}
            onChange={handleChange}
          />
          <label>Cameras Installed</label>
        </div>
        <div className="form-group">
          <input
            type="checkbox"
            name="wifi"
            checked={hotelData.wifi}
            onChange={handleChange}
          />
          <label>Wifi Available</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="ownerPanCardNo"
            value={hotelData.ownerPanCardNo}
            onChange={handleChange}
            placeholder="Owner PAN Card Number"
          />
        </div>
        <div className="form-group">
          <label>Owner Pan Card Images</label>
          <input type="file" name="ownerPanCard" multiple onChange={handleFileChange} />
          {hotelData.ownerPanCard && hotelData.ownerPanCard.length > 0 && (
            <div className="preview-pan-card">
              {hotelData.ownerPanCard.map((pan, index) => (
                <img key={index} src={pan} alt={`Pan Card ${index + 1}`} />
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="ownerAdhaarCardNo"
            value={hotelData.ownerAdhaarCardNo}
            onChange={handleChange}
            placeholder="Owner Aadhaar Card Number"
          />
        </div>
        <div className="form-group">
          <label>Owner Adhar Card Images</label>
          <input type="file" name="ownerAdhaarCard" multiple onChange={handleFileChange} />
          {hotelData.ownerAdhaarCard && hotelData.ownerAdhaarCard.length > 0 && (
            <div className="preview-adhar-card">
              {hotelData.ownerAdhaarCard.map((adhar, index) => (
                <img key={index} src={adhar} alt={`Adhar Card ${index + 1}`} />
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Days Availability</label>
          <select
            name="daysAvailiblity"
            value={hotelData.daysAvailiblity}
            onChange={handleChange}
          >
            <option value="Everyday">Everyday</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="checkbox"
            name="alldaysAvailable"
            checked={hotelData.alldaysAvailable}
            onChange={handleChange}
          />
          <label>All Days Available</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="from"
            value={hotelData.from}
            onChange={handleChange}
            placeholder="From"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="to"
            value={hotelData.to}
            onChange={handleChange}
            placeholder="To"
          />
        </div>
        <button type="submit">{isEditMode ? 'Update Hotel' : 'Register Hotel'}</button>
      </form>
    </div>
  );
}

export default RegisterHotel;
