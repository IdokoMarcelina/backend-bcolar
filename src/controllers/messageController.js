

const Message = require('../models/Message'); 

const socketIoHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendMessage', async (message) => {
      console.log('Received message:', message);

      const newMessage = new Message({
        user: message.user,
        text: message.text,
      });
      await newMessage.save();

      io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};



const fetchAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }); 
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

module.exports = {
    
    socketIoHandler, 
    fetchAllMessages 
};
