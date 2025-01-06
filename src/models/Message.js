const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,  // Fixed typo here
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,  // Fixed typo here
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,  // Consider making this optional if images are not always present
  },
}, {
  timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
