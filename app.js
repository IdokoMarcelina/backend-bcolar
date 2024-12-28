const express = require('express');
require("dotenv").config();
require("./src/config/connectDB")
const PORT = process.env.PORT || 3300;
const authRoutes = require('./src/routes/auth');
const otpRoutes = require('./src/routes/otp')
const profileRoutes = require('./src/routes/profile')
const servicesRoutes = require('./src/routes/services')
const cors = require('cors')
const app = express();
app.use(express.json());

app.use(cors({
  origin: '*'
}));




app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/service', servicesRoutes)

app.get('/', (req, res) => {
    res.send('Server is running');
  });


app.listen(PORT, console.log('server is up'))
