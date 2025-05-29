import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  fileName: String,
  oneDriveId: String,
  webUrl: String,
  fileSlug: String,
  uploadedAt: { type: Date, default: Date.now }
});

const subjectSchema = new mongoose.Schema({
  subject: String,
  files: [fileSchema]
});

const branchSchema = new mongoose.Schema({
  branch: { type: String, required: true, unique: true },
  subjects: [subjectSchema]
});

const Branch = mongoose.model('Branch', branchSchema);
export default Branch;
