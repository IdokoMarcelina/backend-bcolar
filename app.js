const express = require('express');
require("dotenv").config();
require("./src/config/connectDB")
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
    // await createMessage(msg);
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

app.get('/', (req, res) => {
    res.send('Server is up andrunning');
  });

app.post('/sendMessages/:id', auth, async (req, res)=>{

  try {
     const {text, image} = req.body
     const {id: receiverId} = req.params
     const senderId = req.user._id

    let imageurl;
    if(image){
      const uplaodResponse = await cloudinary.uploader(image);
      imageurl = uplaodResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageurl,
    })

      await newMessage.save()
      //todo: real time functionality

      res.status(200).json(newMessage)
  } catch (error) {
    console.log("error in getUserforSidebar", error);
      res.status(500).json(error)
  }
})
app.get('/getMessages/:id', auth, async (req, res)=>{

  try {
      const { id:userToChatId } = req.params
      const myId = req.user._id;
      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      })
      res.status(200).json(messages)
  } catch (error) {
    console.log("error in getUserforSidebar", error);
      res.status(500).json(error)
  }
})
app.get('/getUsersforSidebar', auth, async (req, res)=>{

  try {
      const loggedInUserId = req.user._id;

      const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
      res.status(200).json(filteredUsers)
  } catch (error) {
    console.log("error in getUserforSidebar", error);
      res.status(500).json(error)
  }
})





server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
