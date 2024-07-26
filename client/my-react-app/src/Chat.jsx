import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button, Form, InputGroup, ListGroup, Spinner } from 'react-bootstrap';
import { useSocket } from './SocketContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chat.css';

const apiurl = import.meta.env.VITE_BASE_API_URL;

function Chats() {
  const { socket } = useSocket();
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiurl}/chats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch chats');
        }

        const data = await response.json();
        setChats(data);
      } catch (error) {
        toast.error('An error occurred while fetching chats. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (socket) {
      // Handle incoming messages
      socket.on('newMessage', (message) => {
        console.log("Received message: ", message);
        setChats((prevChats) => prevChats.map((chat) => {
          if (chat.hotelId === message.hotelId) {
            return {
              ...chat,
              messages: [...chat.messages, message],
              unreadCount: chat.unreadCount + 1,
            };
          }
          return chat;
        }));

        if (selectedChat && selectedChat.hotelId === message.hotelId) {
          setSelectedChat((prevChat) => ({
            ...prevChat,
            messages: [...prevChat.messages, message],
          }));
        }
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket, selectedChat]);

  useEffect(() => {
    if (selectedChat && socket) {
      socket.emit('joinRoom', selectedChat.hotelId);

      const fetchMessages = async () => {
        try {
          const response = await fetch(`${apiurl}/getMessage/${loggedInUserId}/${selectedChat.hotelId}`, {
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
          setSelectedChat((prevChat) => ({
            ...prevChat,
            messages: data.messages,
          }));
        } catch (error) {
          toast.error('An error occurred while fetching messages. Please try again.');
        }
      };

      fetchMessages();

      return () => {
        socket.emit('leaveRoom', selectedChat.hotelId);
      };
    }
  }, [selectedChat?.hotelId, socket, loggedInUserId]);

  const handleChatClick = (chat) => {
    if (selectedChat?.hotelId !== chat.hotelId) {
      setSelectedChat(chat);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedChat) {
      return;
    }

    try {
      // Get the logged-in user ID from local storage
      const loggedInUserId = localStorage.getItem('userId');
      if (!loggedInUserId) {
        throw new Error('User ID not found');
      }

      // Determine the senderId for the message from existing messages in the selected chat
      let senderId = null;
      if (selectedChat.messages.length > 0) {
        // Find a senderId from existing messages that is not the current logged-in user
        const existingSender = selectedChat.messages.find(
          (message) => message.senderId !== loggedInUserId
        );
        senderId = existingSender ? existingSender.senderId : 'defaultSenderId'; // Use a default senderId if no valid senderId is found
      } else {
        senderId = 'defaultSenderId'; // Use a default senderId if no messages exist
      }
      const messageData = { senderId, message: newMessage, hotelId: selectedChat.hotelId };
      const response = await fetch(`${apiurl}/sendMessage/${senderId}/${selectedChat.hotelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Emit message to the server
      socket.emit('sendMessage', messageData);

      // Update local chat state
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.hotelId === selectedChat.hotelId
            ? { ...chat, messages: [...chat.messages, messageData] }
            : chat
        )
      );

      setSelectedChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, messageData],
      }));

      setNewMessage('');
    } catch (error) {
      toast.error('An error occurred while sending the message. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Chats</h2>
      <div className="row">
        <div className="col-md-4">
          {isLoading ? (
            <Spinner animation="border" />
          ) : (
            <ListGroup>
              {chats.map((chat, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  onClick={() => handleChatClick(chat)}
                  active={selectedChat && selectedChat.hotelId === chat.hotelId}
                >
                  {chat.hotelName}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
        <div className="col-md-8">
          {selectedChat ? (
            <div className="chat-box">
              <div className="messages">
                {selectedChat.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.senderId === loggedInUserId ? 'sent' : 'received'}`}
                  >
                    {message.message}
                  </div>
                ))}
              </div>
              <InputGroup className="mt-3">
                <Form.Control
                  type="text"
                  placeholder="Type a message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button variant="primary" onClick={handleSendMessage}>
                  Send
                </Button>
              </InputGroup>
            </div>
          ) : (
            <p>Select a chat to start messaging</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chats;
