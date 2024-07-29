// Notification.js
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSocket } from './SocketContext';
import recieveTuneSrc from './sounds/mixkit-software-interface-start-2574.wav';

const apiurl = import.meta.env.VITE_BASE_API_URL;

function Notification() {
  const { socket } = useSocket();
  const [newMessage, setNewMessage] = useState(null);
  const recieveTune = new Audio(recieveTuneSrc); 
  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchMessages = async (hotelId) => {
      try {
        const response = await fetch(`${apiurl}/getMessage/${loggedInUserId}/${hotelId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        // Handle the fetched messages as needed
        console.log('Fetched messages:', data.messages);
      } catch (error) {
        toast.error('An error occurred while fetching messages. Please try again.');
      }
    };

    if (socket) {
      socket.on('newMessage', (message) => {
        recieveTune.play();
        setNewMessage(message);
        toast.info(`New message Received ${message.senderName}: ${message.message}`);
        fetchMessages(message.hotelId);
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket, loggedInUserId]);

  return null;
}

export default Notification;
