const mongoose = require("mongoose");

const chatMessageSchema = mongoose.Schema({
  content: { type: String, required: true },
  from: { type: Object, required: true },
  to: { type: String, required: true },
  type: { type: String, enum: ["private", "group", "chatroom"] },
  date: { type: String, required: true },
  time: { type: String, required: true },
});

const ChatMessageModel = mongoose.model("chatMessage", chatMessageSchema);

module.exports = { ChatMessageModel };
