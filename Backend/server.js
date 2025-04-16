require('dotenv').config();
const express = require('express')
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const mechanicRoutes = require('./routes/mechanicRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');


app.use(express.json())

app.use(cors());

connectDB();

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/mechanics', mechanicRoutes);

app.use('/api/appointments', appointmentRoutes);

app.use('/api/user/me', userRoutes);

// Test Route
app.get('/test', (req, res) => {
  res.send('Server OK');
});

app.get('/', (req, res) => {
  res.send('Car Service Backend is Running')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}, http://localhost:${port}`)
})