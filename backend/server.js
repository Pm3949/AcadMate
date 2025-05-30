import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";


import connectDB from './db.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoytes.js';
import materialRoutes from './routes/materialRoutes.js';


const app = express();
const port = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Middleware
const allowedOrigins = ['https://acadmate-vx8s.onrender.com', 'https://acadmate-admin.onrender.com'];
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
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      secure: true, // Important for HTTPS on Render
      sameSite: "none", // Allow cross-origin session (important if admin panel is on a different domain)
      httpOnly: true,
    },
  })
);

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
