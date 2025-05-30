import mongoose from "mongoose";
import bcrypt from "bcrypt";

const fileSchema = new mongoose.Schema({
  fileName: String,
  oneDriveId: String,
  webUrl: String,
  fileSlug: String,
});
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
  files: [fileSchema],
});

export default mongoose.model("User", UserSchema);
