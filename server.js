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
console.log(process.env.FRONTEND_URL)
app.use(cors(corsOptions));
app.use(express.json());


app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Backend Status</title></head>
      <body>
        <h1>Backend is working!</h1>
        <p>This is a simple HTML response from the backend.</p>
      </body>
    </html>
  `);
});

app.use('/api/users', userRoutes);
app.use('/api/referrals', referralRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
