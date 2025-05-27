import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  subject: { type: String, required: true },
  fileName: { type: String, required: true },
  oneDriveId: { type: String, required: true },
  webUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const Pdf = mongoose.model('Pdf', pdfSchema);

export default Pdf;
