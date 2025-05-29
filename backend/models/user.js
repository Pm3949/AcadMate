import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  collegeName: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
});



export default mongoose.model('User', UserSchema);
