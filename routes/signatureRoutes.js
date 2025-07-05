
// routes/signatureRoutes.js
const express = require("express");
const router = express.Router();
const { saveSignature, getSignatures , generateSignedPdf } = require("../controllers/signatureController");
const authMiddleware = require("../middleware/Auth");

router.post("/save", authMiddleware, saveSignature);
router.get("/:fileId", authMiddleware, getSignatures);

router.post('/generate/:fileId', generateSignedPdf);

module.exports = router;