import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import cookieParser from "cookie-parser";
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import connectDB from './db.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoytes.js';
import materialRoutes from './routes/materialRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Middleware
const allowedOrigins = [
  'https://acadmate-vx8s.onrender.com',
  'https://acadmate-admin.onrender.com'
  // 'http://localhost:3000',
];

app.use(cookieParser());

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

// Rate Limiting to prevent crash on flood
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 49, // Max 49 requests per IP per minute
  message: '⚠️ Too many requests. Try again in a minute.'
});
app.use(limiter);

// Request Logger
app.use(morgan('dev'));

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
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

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/materials', materialRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
});
