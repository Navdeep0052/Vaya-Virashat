const {default : mongoose, Schema} = require("mongoose");

const chatSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    hotelId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hotels",
    },
    message: {
        type: String,
        required: true,
    },
    // status: {
    //     type: String,   
    //     enum : ["pending","resolved"],
    //     required : true
    // }
    isRead : {
        type : Boolean,
        default : false
    }
});

const Chat = mongoose.model("chats", chatSchema)

module.exports = Chat