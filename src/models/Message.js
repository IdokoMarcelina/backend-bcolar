
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  receiverId: { 
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    
  },
 
},

{
    timestamps: true
}
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
