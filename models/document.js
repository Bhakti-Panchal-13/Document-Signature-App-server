const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  filename: String,
  path: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
    isSigned: { type: Boolean, default: false },
    signedFileUrl: { type: String },
});

module.exports = mongoose.models.Document || mongoose.model('Document', DocumentSchema);
