import React, { useState, useEffect } from 'react';

const Profile = ({ apiurl, socket }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(apiurl + '/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setUserProfile(data.user);
        } else {
          setError('Failed to fetch profile');
        }
      } catch (error) {
        setError('An error occurred while fetching the profile');
      } finally {
        setLoading(false);
      }
    };

    // Call the function to fetch user profile
    fetchUserProfile();

    // Establish socket connection when component mounts
    socket?.connect();

    // Disconnect socket when component unmounts
    return () => {
      socket?.disconnect();
    };
  }, [apiurl, socket]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {userProfile ? (
        <div>
          <p>Welcome, {userProfile?.name}!</p>
          {/* Render additional user details */}
        </div>
      ) : (
        <div>No user profile found</div>
      )}
    </div>
  );
};

export default Profile;
