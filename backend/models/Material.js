import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileName: String,
  oneDriveId: String,
  webUrl: String,
  fileSlug: String,
});

const subjectSchema = new mongoose.Schema({
  subject: String,
  files: [fileSchema],
});

const branchSchema = new mongoose.Schema({
  branch: String,
  subjects: [subjectSchema],
});

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  branches: [branchSchema],
});

const StudyMaterial = mongoose.model("StudyMaterial", categorySchema);
export default StudyMaterial;
