const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
	{
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
                ref: "user",
			},
		],
        hotelId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "hotel",
        },
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "chats",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);

