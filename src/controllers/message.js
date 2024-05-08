const Message = require('../models/messageModel');

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({});
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.postMessage = async (data) => {
    const { username, message } = data;
    const newMessage = new Message({ username, message });
    try {
        await newMessage.save();
        return newMessage;
    } catch (err) {
        console.error(err);
        return null;
    }
};
