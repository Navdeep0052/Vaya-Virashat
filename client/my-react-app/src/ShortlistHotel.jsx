// ShortlistHotel.jsx
import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const apiurl = import.meta.env.VITE_BASE_API_URL;

function ShortlistHotel({ hotelId }) {
  const [shortlisted, setShortlisted] = useState(false);

  useEffect(() => {
    // Fetch initial shortlisted status if needed
  }, [hotelId]);

  const handleShortlist = async () => {
    try {
      const response = await fetch(`${apiurl}/shortList/${hotelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to shortlist hotel');
      }

      setShortlisted(!shortlisted);
      toast.success(shortlisted ? 'Hotel removed from shortlist!' : 'Hotel shortlisted successfully!');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <FaStar
      onClick={handleShortlist}
      style={{
        cursor: 'pointer',
        color: shortlisted ? 'yellow' : 'grey',
      }}
    />
  );
}

export default ShortlistHotel;
