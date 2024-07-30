import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Button, Form, InputGroup, ListGroup, Spinner } from 'react-bootstrap';
import { useSocket } from './SocketContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chat.css';
import VideoCallComponent from './VideoCallComponent'; // Import the VideoCallComponent

const apiurl = import.meta.env.VITE_BASE_API_URL;

// Import the audio file directly
import sendTuneSrc from './sounds/mixkit-long-pop-2358.wav';
import recieveTuneSrc from './sounds/mixkit-software-interface-start-2574.wav';

function Chats() {
  const { socket } = useSocket();
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [peerConnection, setPeerConnection] = useState(null); // Manage peer connection state
  const [remoteStream, setRemoteStream] = useState(null); // Manage remote stream state
  const [showVideoCall, setShowVideoCall] = useState(false); // Manage video call visibility
  const loggedInUserId = localStorage.getItem('userId');
  const sendTune = new Audio(sendTuneSrc);
  const recieveTune = new Audio(recieveTuneSrc);
  const messagesEndRef = useRef(null);

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
        recieveTune.play();
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
          scrollToBottom();
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
          scrollToBottom();
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
      const loggedInUserId = localStorage.getItem('userId');
      if (!loggedInUserId) {
        throw new Error('User ID not found');
      }

      let receiverId = null;
      if (selectedChat.messages.length > 0) {
        const existingSender = selectedChat.messages.find(
          (message) => message.receiverId !== loggedInUserId
        );
        receiverId = existingSender ? existingSender.receiverId : 'defaultreceiverId';
      } else {
        receiverId = 'defaultreceiverId';
      }

      const messageData = { senderId: loggedInUserId, receiverId, message: newMessage, hotelId: selectedChat.hotelId };

      setSelectedChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, messageData],
      }));

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.hotelId === selectedChat.hotelId
            ? { ...chat, messages: [...chat.messages, messageData] }
            : chat
        )
      );

      socket.emit('sendMessage', messageData);

      const response = await fetch(`${apiurl}/sendMessage/${receiverId}/${selectedChat.hotelId}`, {
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

      setNewMessage('');
      sendTune.play();
      scrollToBottom();
    } catch (error) {
      toast.error('An error occurred while sending the message. Please try again.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartCall = () => {
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);
    setShowVideoCall(true);
  };

  const handleEndCall = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
      setRemoteStream(null);
    }
    setShowVideoCall(false);

    // Trigger a page refresh
    window.location.reload();
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
                  {selectedChat?.hotelId === chat.hotelId && (
                    <span className="chat-count">
                      {selectedChat.unreadCount > 0 && selectedChat.unreadCount}
                    </span>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
        <div className="col-md-8">
          {selectedChat ? (
            <div className="chat-box">
              <div className="chat-header">
                <h5>{selectedChat.hotelName}</h5>
                <button className="btn btn-outline-primary" onClick={handleStartCall}>
                  📹 Start Call
                </button>
                {showVideoCall && (
                  <button className="btn btn-outline-danger" onClick={handleEndCall}>
                    ❌ End Call
                  </button>
                )}
              </div>
              <div className="messages">
                {selectedChat.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.senderId === loggedInUserId ? 'sent' : 'received'}`}
                  >
                    {message.message}
                  </div>
                ))}
                <div ref={messagesEndRef} />
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
      {showVideoCall && (
        <VideoCallComponent
          peerConnection={peerConnection}
          remoteStream={remoteStream}
          endCall={handleEndCall}
        />
      )}
    </div>
  );
}

export default Chats;
