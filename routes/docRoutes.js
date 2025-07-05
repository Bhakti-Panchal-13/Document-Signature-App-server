const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); 
const { uploadPDF } = require('../controllers/docController');
const { getAllDocuments } = require('../controllers/docController');
const authMiddleware = require('../middleware/Auth');
const { deleteDocument , getDocumentById } = require('../controllers/docController');

router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  uploadPDF
);
// List all documents
router.get('/all', authMiddleware, getAllDocuments); // 👈 this must match `/api/docs/all`
router.get("/:id", authMiddleware, getDocumentById);
router.delete('/:id', authMiddleware, deleteDocument);

module.exports = router;

