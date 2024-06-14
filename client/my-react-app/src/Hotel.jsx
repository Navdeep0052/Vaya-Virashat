// import React, { useState } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
// import './Hotel.css';

// const apiurl = import.meta.env.VITE_BASE_API_URL;

// function RegisterHotel() {
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
//   const navigate = useNavigate();

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
//       [name]: uploadedFiles.map(file => file.Location),
//     }));
//   };

//   const uploadFiles = async (files) => {
//     const formData = new FormData();
//     for (let i = 0; i < files.length; i++) {
//       formData.append('files', files[i]);
//     }

//     try {
//       const response = await fetch(apiurl + '/upload', {
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
//       const response = await fetch(apiurl + '/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + localStorage.getItem('token'), 
//         },
//         body: JSON.stringify(hotelData),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         toast.success(data.message || 'Hotel registration successful!');
//         navigate('/hotel-list');
//       } else {
//         toast.error(data.error || 'Registration failed. Please try again.');
//       }
//     } catch (error) {
//       toast.error('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="register-hotel-container">
//       <ToastContainer />
//       <form className="register-hotel-form" onSubmit={handleSubmit}>
//         <h2>Register Hotel</h2>
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
//             //required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="url"
//             name="link"
//             value={hotelData.link}
//             onChange={handleChange}
//             placeholder="Website Link"
//             //required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="file"
//             name="logo"
//             onChange={handleFileChange}
//             placeholder="Hotel logo"
//             //required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="file"
//             name="images"
//             multiple
//             onChange={handleMultiFileChange}
//             //required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="file"
//             name="videos"
//             multiple
//             onChange={handleMultiFileChange}
//             //required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="url"
//             name="map"
//             value={hotelData.map}
//             onChange={handleChange}
//             placeholder="Map Link"
//             //required
//           />
//         </div>
//         <div className="form-group">
//           <textarea
//             name="description"
//             value={hotelData.description}
//             onChange={handleChange}
//             placeholder="Description"
//             //required
//           ></textarea>
//         </div>
//         <div className="form-group">
//           <input
//             type="text"
//             name="confirmRegNumber"
//             value={hotelData.confirmRegNumber}
//             onChange={handleChange}
//             placeholder="Registration Number"
//             //required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="text"
//             name="area"
//             value={hotelData.area}
//             onChange={handleChange}
//             placeholder="Area (sqft)"
//             //required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="number"
//             name="hotelStar"
//             value={hotelData.hotelStar}
//             onChange={handleChange}
//             placeholder="Hotel Star Rating"
//             //required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="file"
//             name="propertyPapers"
//             multiple
//             onChange={handleMultiFileChange}
//             //required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="file"
//             name="agreementPapers"
//             multiple
//             onChange={handleMultiFileChange}
//             //required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="file"
//             name="electricityBill"
//             multiple
//             onChange={handleMultiFileChange}
//             //required
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
//           <input
//             type="file"
//             name="ownerAdhaarCard"
//             multiple
//             onChange={handleMultiFileChange}
//             //required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="text"
//             name="ownerAdhaarCardNo"
//             value={hotelData.ownerAdhaarCardNo}
//             onChange={handleChange}
//             placeholder="Owner Aadhaar Card Number"
//             //required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="file"
//             name="ownerPanCard"
//             multiple
//             onChange={handleMultiFileChange}
//             //required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="text"
//             name="ownerPanCardNo"
//             value={hotelData.ownerPanCardNo}
//             onChange={handleChange}
//             placeholder="Owner Pan Card Number"
//             //required
//           />
//         </div>
//         <button type="submit">Register Hotel</button>
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
  const { hotelId } = useParams(); // Assuming you have set up React Router properly
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
    wifi: false,
    ownerAdhaarCard: [],
    ownerAdhaarCardNo: '',
    ownerPanCard: [],
    ownerPanCardNo: '',
  });

  useEffect(() => {
    // If hotelId is present in URL, it means we are in edit mode
    if (hotelId) {
      setIsEditMode(true);
      fetchHotelData();
    }
  }, [hotelId]);

  const fetchHotelData = async () => {
    try {
      const response = await fetch(apiurl + `/hotels/${hotelId}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hotel data');
      }

      const data = await response.json();
      setHotelData(data); // Assuming the response provides the hotel data
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
      [name]: uploadedFiles[0]?.Location || '',
    }));
  };

  const handleMultiFileChange = async (e) => {
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
      const response = await fetch(apiurl + '/upload', {
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
      let url = apiurl + '/register';
      let method = 'POST';

      if (isEditMode) {
        url = apiurl + `/editHotel/${hotelId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(hotelData),
      });

      const data = await response.json();
      if (response.ok) {
        const message = isEditMode ? 'Hotel updated successfully!' : (data.message || 'Hotel registered successfully!');
        toast.success(message);
        navigate('/hotel-list');
      } else {
        const errorMessage = isEditMode ? 'Hotel update failed. Please try again.' : (data.error || 'Registration failed. Please try again.');
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
          <input
            type="file"
            name="logo"
            onChange={handleFileChange}
            placeholder="Hotel logo"
          />
        </div>
        <div className="form-group">
          <input
            type="file"
            name="images"
            multiple
            onChange={handleMultiFileChange}
          />
        </div>
        <div className="form-group">
          <input
            type="file"
            name="videos"
            multiple
            onChange={handleMultiFileChange}
          />
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
          <input
            type="file"
            name="propertyPapers"
            multiple
            onChange={handleMultiFileChange}
          />
        </div>
        <div className="form-group">
          <input
            type="file"
            name="agreementPapers"
            multiple
            onChange={handleMultiFileChange}
          />
        </div>
        <div className="form-group">
          <input
            type="file"
            name="electricityBill"
            multiple
            onChange={handleMultiFileChange}
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="cameras"
              checked={hotelData.cameras}
              onChange={handleChange}
            />
            Cameras
          </label>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="wifi"
              checked={hotelData.wifi}
              onChange={handleChange}
            />
            WiFi
          </label>
        </div>
        <div className="form-group">
          <input
            type="file"
            name="ownerAdhaarCard"
            multiple
            onChange={handleMultiFileChange}
          />
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
          <input
            type="file"
            name="ownerPanCard"
            multiple
            onChange={handleMultiFileChange}
          />
        </div>
        <div className="form-group">
           <input
            type="text"
            name="ownerPanCardNo"
            value={hotelData.ownerPanCardNo}
            onChange={handleChange}
            placeholder="Owner Pan Card Number"
            //required
          />
        </div>
        <button type="submit">Register Hotel</button>
      </form>
    </div>
  );
}

export default RegisterHotel;