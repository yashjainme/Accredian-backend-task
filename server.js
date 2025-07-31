const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const referralRoutes = require('./routes/referralRoutes');

const app = express();

// Configure CORS to allow only specific origin
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/referrals', referralRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
