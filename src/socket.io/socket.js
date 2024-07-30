const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Handle WebRTC signaling
  socket.on("offer", ({ offer, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("offer", { offer, senderId: userId });
    }
  });

  socket.on("answer", ({ answer, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("answer", { answer, senderId: userId });
    }
  });

  socket.on("candidate", ({ candidate, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("candidate", { candidate, senderId: userId });
    }
  });

  // Handle starting a video call
  socket.on("startVideoCall", ({ receiverId, hotelId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveVideoCall", { senderId: userId, hotelId });
    }
  });

  // Handle answering a video call
  socket.on("answerVideoCall", ({ senderId }) => {
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("videoCallAnswered", { receiverId: userId });
    }
  });

  // Handle ending a video call
  socket.on("endVideoCall", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("videoCallEnded", { senderId: userId });
    }
  });
});

module.exports = { app, io, server, getReceiverSocketId };
