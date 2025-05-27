import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';

import connectDB from './db.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoytes.js';

const app = express();
const port = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // update if using a different frontend domain
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

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
});
