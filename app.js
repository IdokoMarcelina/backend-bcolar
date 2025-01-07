const express = require('express');
require("dotenv").config();
require("./src/config/connectDB")
const User = require('./src/models/User');
const Chat = require('./src/models/Chat');
const messageModel = require('./src/models/Message');

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});



const PORT = process.env.PORT || 3000;
const authRoutes = require('./src/routes/auth');
const otpRoutes = require('./src/routes/otp')
const profileRoutes = require('./src/routes/profile')
const servicesRoutes = require('./src/routes/services')
const collaboRoutes = require('./src/routes/collabo')
const chatRoutes = require('./src/routes/chat')
const messageRoutes = require('./src/routes/messsages')
const ratingReviewRoutes = require('./src/routes/ratingReview')



const cors = require('cors');
const auth = require('./src/middleware/authmiddleware');
const Message = require('./src/models/Message');
const mongoose = require('mongoose')

app.use(express.json({limit: "10mb"}));
const configuration = {origin: "*", 
  methods : ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], 
  allowedHeaders: ["Content-Type", "Authorization"],
credentials: true}
app.use(cors(configuration));

io.on("connection", (socket) => {

  socket.on('chat_message', (msg) => {

    io.emit('chat_message_'+msg.receiverId, msg)
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });

  socket.on('disconnect', (socket) => {
    console.log('User disconnected:', socket.id);
  });

});

app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/service', servicesRoutes)
app.use('/api/collabo', collaboRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)
app.use('/api/ratingReview',ratingReviewRoutes)


app.post('/createChat', async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
      const chat = await Chat.findOne({
          members: { $all: [firstId, secondId] },
      });
      if (chat) return res.status(200).json(chat);

      const newChat = new Chat({
          members: [firstId, secondId],
      });

      const response = await newChat.save();

      res.status(200).json({
          message: "Chat created successfully.",
          data: response,
      });
  } catch (error) {
      console.log(error);
      res.status(500).json(error);
  }
});

app.get('/findUserChats/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      const chats = await Chat.find({
          members: { $in: [userId] },
      });
      res.status(200).json(chats);
  } catch (error) {
      console.log(error);
      res.status(500).json(error);
  }
});

app.get('/findChat/:firstId/:secondId', async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
      const chat = await Chat.find({
          members: { $all: [firstId, secondId] },
      });

      res.status(200).json(chat);
  } catch (error) {
      console.log(error);
      res.status(500).json(error);
  }
});

app.post('/createMessage', async (req, res) => {
  const { chatId, senderId, receiverId, text } = req.body;

  if (!chatId || !senderId || !receiverId || !text) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const message = new Message({
    chatId,
    senderId,
    text,
  });

  try {
    const response = await message.save();

    io.emit('chat_message_' + receiverId, {
      chatId,
      senderId,
      receiverId,
      text,
    });

    io.to(chatId).emit('new_message', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});


app.get('/getMessages/:chatId', async (req, res) => {
  const { chatId } = req.params;

  try {
      const messages = await Message.find({ chatId });
      res.status(200).json(messages);
  } catch (error) {
      res.status(500).json(error);
  }
});


app.get('/getSidebarMessages/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const messages = await Message.find({ $or: [{ senderId: userId }, { receiverId: userId }] })
      .populate('senderId receiverId'); 

    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: 'No messages found for this user' });
    };

    res.status(200).json(messages);
  } catch (error) {
    console.error('Failed to fetch sidebar messages:', error);
    res.status(500).json({ error: 'Failed to fetch sidebar messages' });
  }
});





app.get('/', (req, res) => {
    res.send('Server is up andrunning');
  });



server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
