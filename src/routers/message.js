// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
// const Message = require('../controllers/message');
const socketIO = require('socket.io');

const Message = require('../models/messageModel');

let io;

router.setSocketIO = function(socketIOInstance) {
    io = socketIOInstance;
};

router.get('/', async (req, res) => {
    try {
        const messages = await Message.find({});
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    const { username, message } = req.body;
    const newMessage = new Message({ username, message });
    try {
        await newMessage.save();
        io.emit('message', newMessage);
        res.status(201).json(newMessage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
