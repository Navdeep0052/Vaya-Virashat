import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button, Form, Modal } from 'react-bootstrap';
import io from 'socket.io-client';

const apiurl = import.meta.env.VITE_BASE_API_URL;
const socket = io(apiurl, {
  query: { userId: localStorage.getItem('userId') },
  transports: ['websocket'],
});

function ChatBox({ hotelId, ownerId, onClose }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Join the chat room for the specific hotel
    socket.emit('joinRoom', hotelId);

    return () => {
      // Clean up the socket connection on component unmount
      socket.off('receiveMessage');
      socket.emit('leaveRoom', hotelId);
    };
  }, [hotelId]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Message cannot be empty.');
      return;
    }

    setIsLoading(true);
    try {
      // Hit the API to save the message
      const response = await fetch(`${apiurl}/sendMessage/${ownerId}/${hotelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const senderId = localStorage.getItem('userId');
      // Emit the message via WebSocket for real-time updates
      socket.emit('sendMessage', { senderId, text: message, hotelId });
      setMessages((prevMessages) => [...prevMessages, { senderId, text: message }]);
      setMessage('');
      toast.success('Message sent successfully!');
    } catch (error) {
      toast.error('An error occurred while sending the message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chat with Hotel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <strong>{msg.senderId === localStorage.getItem('userId') ? 'You' : 'Hotel'}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <Form.Group controlId="message">
          <Form.Control
            as="textarea"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ChatBox;
