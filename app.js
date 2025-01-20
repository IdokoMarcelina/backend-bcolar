const express = require('express');
require("dotenv").config();
require("./src/config/connectDB")
const cron = require("node-cron");
const dau = require("./src/controllers/dauContoller")

const User = require('./src/models/User');
const Chat = require('./src/models/Chat');
const messageModel = require('./src/models/Message');
// 
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
})




const PORT = process.env.PORT || 3000;
const authRoutes = require('./src/routes/auth');
const otpRoutes = require('./src/routes/otp')
const profileRoutes = require('./src/routes/profile')
const servicesRoutes = require('./src/routes/services')
const collaboRoutes = require('./src/routes/collabo')
const chatRoutes = require('./src/routes/chat')
const messageRoutes = require('./src/routes/messsages')
const ratingReviewRoutes = require('./src/routes/ratingReview')
const adminRoutes = require('./src/routes/admin')
const dauRoutes = require('./src/routes/dau')



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
app.use('/api/admin',adminRoutes)
app.use('/api/dau',dauRoutes)
// app.use('/api/message',messageRoutes)
app.use('/api/ratingReview',ratingReviewRoutes)


app.post('/createChat', async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
      let chat = await Chat.findOne({
          members: { $all: [firstId, secondId] },
      });

      if (chat) {
          // Update timestamp or any other required field
          chat.updatedAt = new Date();
          await chat.save();
          return res.status(200).json({
              message: "Chat already exists, updated timestamp.",
              data: chat,
          });
      }

      // Create new chat if it doesn't exist
      const newChat = new Chat({
          members: [firstId, secondId],
      });

      const response = await newChat.save();

      res.status(200).json({
          message: "Chat created successfully.",
          data: response,
      });

  } catch (error) {
      console.error("Error creating/updating chat:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


app.get('/findUserChats/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      const chats = await Chat.find({
          members: { $in: [userId] },
      });

    // Step 2: For each chat, get the other member's ID
    const otherMemberIds = chats.map((chat) =>
      chat.members.find((member) => member != userId)
    );

    // Step 3: Fetch user details for the other members
    const otherMembers = await User.find({ _id: { $in: otherMemberIds } });

    // Step 4: Combine chat and user details
    const result = chats.map((chat) => {

      const otherMemberId = chat.members.find((member) => member != userId);

      const otherMember = otherMembers.find((user) => user._id.equals(otherMemberId));

      return {
        id: chat._id,
        members: chat.members,
        otherMember: {
          id: otherMember._id,
          name: otherMember.name,
          profilePicture: otherMember.avatar,
        },
      };
    }).filter((chat) => chat !== null);

    // 677f3ae860c1522be6893e73
    
      res.status(200).json(result);
  } catch (error) {
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

   let emit = io.emit('chat_message_' + receiverId, {
      chatId,
      senderId,
      receiverId,
      text,
    });

    console.log(emit,'chat_message_' + receiverId )

    // io.to(chatId).emit('new_message', response);

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



// Schedule DAU collection at midnight every day
cron.schedule("0 0 * * *", async () => {
  try {
    await dau.collectDAU();
    console.log("DAU data collected at midnight.");
  } catch (error) {
    console.error("Error collecting DAU data at midnight:", error);
  }
});



app.get('/', (req, res) => {
    res.send('Server is up andrunning');
  });



server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
