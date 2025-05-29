import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';

import connectDB from './db.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoytes.js';
import materialRoutes from './routes/materialRoutes.js';


const app = express();
const port = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Middleware
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Routes
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

app.get('/success', (req, res) => {
  res.send('✅ OneDrive connected successfully!');
});

// Route files
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/materials', materialRoutes);


// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
});
