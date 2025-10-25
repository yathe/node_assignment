const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const app = express();


connectDB();


// In server.js
const corsOptions = {
  development: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5000'],
    credentials: true
  },
  production: {
    origin: ['https://your-frontend-app.vercel.app'], // Your Vercel frontend URL
    credentials: true
  }
};

app.use(cors(process.env.NODE_ENV === 'production' ? corsOptions.production : corsOptions.development));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('frontend/public'));


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Blog Platform API is running' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
