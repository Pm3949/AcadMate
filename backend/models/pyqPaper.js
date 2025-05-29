import mongoose from 'mongoose';

const fileSchemap = new mongoose.Schema({
  fileName: String,
  oneDriveId: String,
  webUrl: String,
  fileSlug: String,
  uploadedAt: { type: Date, default: Date.now }
});

const subjectSchemap = new mongoose.Schema({
  subject: String,
  files: [fileSchemap]
});

const branchSchemap = new mongoose.Schema({
  branch: { type: String, required: true, unique: true },
  subjects: [subjectSchemap]
});

const Paper = mongoose.model('Branch', branchSchemap);
export default Paper;
