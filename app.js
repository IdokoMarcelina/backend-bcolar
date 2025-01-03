const express = require('express');
require("dotenv").config();
require("./src/config/connectDB")
const http = require('http'); 
const socketIo = require('socket.io');
const PORT = process.env.PORT || 3000;
const authRoutes = require('./src/routes/auth');
const otpRoutes = require('./src/routes/otp')
const profileRoutes = require('./src/routes/profile')
const servicesRoutes = require('./src/routes/services')
const collaboRoutes = require('./src/routes/collabo')


const cors = require('cors')
const app = express();
const server = http.createServer(app); 
const io = socketIo(server); 

app.use(express.json({limit: "10mb"}));
const configuration = {origin: "*", 
  methods : ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], 
  allowedHeaders: ["Content-Type", "Authorization"],
credentials: true}
app.use(cors(configuration));




app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/service', servicesRoutes)
app.use('/api/collabo', collaboRoutes)

app.get('/', (req, res) => {
    res.send('Server is up andrunning');
  });


app.listen(PORT, console.log('server is up'))
