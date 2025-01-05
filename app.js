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


const cors = require('cors')

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



server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
