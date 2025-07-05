const fs = require('fs');
const path = require('path');
const Document = require('../models/document');

const uploadPDF = async (req, res) => {
  try {
    console.log('📎 req.file:', req.file);            // Log uploaded file info
    console.log('📝 req.body:', req.body);            // Log other form fields
    console.log('👤 req.user:', req.user);            // Should be undefined now since auth is off

    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const doc = new Document({
      filename: file.originalname,
      path: file.path,
      uploadedBy: req.user._id
    });

    await doc.save();

    res.status(201).json({ success: true, message: 'File uploaded successfully', doc });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};
// Get a single document by ID
const getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id, // ✅ ensure only the owner can access it
    });

    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found or unauthorized" });
    }

    res.status(200).json({ success: true, document: doc });
  } catch (err) {
    console.error('❌ Error fetching document by ID:', err);
    res.status(500).json({ success: false, message: 'Server error fetching document' });
  }
};

// Get all uploaded documents
const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ uploadedBy: req.user._id }).sort({ uploadedAt: -1 });
    if (!docs.length) {
      return res.status(200).json({ success: true, message: 'No documents found.', documents: [] });
    }

    res.status(200).json({ success: true, documents: docs });
  } catch (err) {
    console.error('❌ Error fetching documents:', err);
    res.status(500).json({ success: false, message: 'Failed to load documents' });
  }
};
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOneAndDelete({
      _id: req.params.id,
      uploadedBy: req.user._id, // security: only allow owner to delete
    });

    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found or not authorized." });
    }

    // Remove file from disk:
    const filePath = path.join(__dirname, '..', doc.path);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file from disk:", err);
    });

    res.json({ success: true, message: "Document deleted successfully." });
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).json({ success: false, message: "Server error deleting document." });
  }
};

module.exports = {
  uploadPDF,
  getAllDocuments,
  deleteDocument,
  getDocumentById,
};

