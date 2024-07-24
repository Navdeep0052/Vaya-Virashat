const Chat = require("../models/chat");
const Hotel = require("../models/registerHotel");
const User = require("../models/user");
const Conversation = require("../models/conversation");
const { getReceiverSocketId, io } = require("./../socket.io/socket");

exports.getMessages = async (req, res) => {
    try {
      let { id: senderId, hotelId } = req.params;
      let receiverId = req.user._id;
  
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
        hotelId: hotelId,
      })
        .populate("messages")
        .populate("participants");
      let senderProfile = "",
        receiverProfile = "",
        senderName = "";
      if (!conversation) {
        return res.status(200).json([]);
      }
  
      const participantMap = new Map(
        conversation.participants.map((participant) => [
          participant._id.toString(),
          participant,
        ])
      );
  
      const formattedMessages = conversation.messages.map((message) => ({
        ...message,
        senderName: participantMap.get(message.senderId.toString()).name,
      }));
  
      let messageData = [];
      for (let i = 0; i < formattedMessages.length; i++) {
        messageData.push({
          _id: formattedMessages[i]._doc._id,
          senderId: formattedMessages[i]._doc.senderId,
          receiverId: formattedMessages[i]._doc.receiverId,
          hotelId: formattedMessages[i]._doc.hotelId,
          message: formattedMessages[i]._doc.message,
          isRead: formattedMessages[i]._doc.isRead,
          createdAt: formattedMessages[i]._doc.createdAt,
          updatedAt: formattedMessages[i]._doc.updatedAt,
          senderName: formattedMessages[i].senderName,
        });
      }
  
      const output = {
        messages: messageData,
        senderName: conversation.participants[0].name,
      };
  
      // const messages = JSON.parse(JSON.stringify(conversation.messages));
  
      // messages.forEach((message) => {
      //   message.senderProfile = senderProfile;
      //   message.senderName = senderName;
      // });
  
      return res.status(200).json(
        // messages: messages,
        // senderProfile: senderProfile,
        // receiverProfile: receiverProfile,
        // senderName: senderName,
        output
      );
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: err.message });
    }
  };

exports.sendMessage = async (req, res) => {
    try {
      const { message } = req.body;
      const { id: receiverId, hotelId } = req.params;
      const senderId = req.user._id;
  
      const chechhotelId = await Hotel.findOne({ _id: hotelId });
      if (!chechhotelId) {
        return res.status(400).send({ error: "Hotel not found" });
      }
     
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
        hotelId,
      });
      let senderName = "",
        receiverName = "",
        hotelName = "";
  
      hotelName = await Hotel
        .findOne({ _id: hotelId })
        .select({ propertyTitle: 1, _id: 0 })
        .lean();
  
      if (hotelName && Object.keys(hotelName).length) {
        hotelName = hotelName.propertyTitle;
      }
     
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
          hotelId,
        });
      }
  
      let newMessage = new Chat({
        senderId,
        receiverId,
        hotelId,
        message,
      });
      if (newMessage) {
        conversation.messages.push(newMessage._id);
      }
  
      await Promise.all([conversation.save(), newMessage.save()]);
  
      newMessage = JSON.parse(JSON.stringify(newMessage));
  
      newMessage["senderName"] = senderName;
      newMessage["receiverName"] = receiverName;
      newMessage["hotelName"] = hotelName;
  
      const receiverSocketId = getReceiverSocketId(receiverId);
  
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      } else {
        const data = {
          newMessage: newMessage,
          Name : receiverName
        }
      }
  
      return res.status(201).json(newMessage);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };

  exports.chats = async (req, res) => {
    try {
      console.log("chat list");
      let searchKey = req.query.search || "";
      let query = {};
  
      const { _id: loggedInUserId} = req.user;
  
      let conversation = await Conversation.find({
        participants: { $in: [loggedInUserId] },
      })
        .populate("hotelId")
        .populate("participants")
        .populate("messages")
        .select({ createdAt: 0, __v: 0 });
  
      if (!conversation) {
        return res.status(200).json([]);
      }
      let result = [],
        data = {};
      conversation.map((con) => {
        let participants = con.participants;
        let property = con.hotelId;
  
        let messages = con.messages;
        let count = 0;
        participants.map((p) => {
          if (p._id.toString() === loggedInUserId) {
            data = {
              ...data,
              receiverName: p.name,
            };
          } else {
            data = {
              ...data,
              senderName: p.name,
            };
          }
        });
  
        messages.map((m) => {
          if (!m.isRead && m.receiverId == loggedInUserId) {
            count++;
          }
          data = {
            ...data,
            recentlyReceivedMessage: m.updatedAt,
          };
        });
  
        data = {
          ...data,
          hotelId: property?._id,
          hotelName: property?.hotelName,
          updatedAt: con?.updatedAt,
          unreadCount: count,
          messages: con.messages,
        };
        result.push(data);
      });
  
      if (searchKey && searchKey.length) {
        searchKey = searchKey.toLowerCase();
        result = result.filter((c) => {
          return (
            c?.senderName.toLowerCase().includes(searchKey) ||
            c?.hotelName?.toLowerCase().includes(searchKey)
          );
        });
      }
      result.sort((a, b) => {
        if (a.recentlyReceivedMessage > b.recentlyReceivedMessage) return -1;
        else return 1;
      });
      if (result.length) {
        io.emit("updatedChatList", result);
      }
      if (data) {
        if (!data.hotelId) {
          return res.status(404).send({
            error: "No property associated with the conversation or removed",
          });
        }
      }
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: error.message });
    }
  };