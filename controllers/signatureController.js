const Signature = require('../models/Signature');
const Document = require('../models/document'); 
const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

// Save signature Position + image
exports.saveSignature = async (req, res) => {
  try {
    const { fileId, x, y, page, imageData } = req.body;
    const signer = req.user._id;

    const newSignature = new Signature({
      fileId,
      signer,
      x,
      y,
      page,
      imageData,
      status: "signed",
    });

    await newSignature.save();

    // 🔥 Automatically mark the document as signed
    await Document.findByIdAndUpdate(fileId, { isSigned: true });
    res.status(201).json({ success: true, signature: newSignature });
  } catch (err) {
    console.error("❌ Error saving signature:", err);
    res.status(500).json({ success: false, message: "Failed to save signature" });
  }
};

// Get all signatures for a document
exports.getSignatures = async (req, res) => {
  try {
    const { fileId } = req.params;
    const signatures = await Signature.find({ fileId });
    res.status(200).json({ success: true, signatures });
  } catch (err) {
    console.error("❌ Error fetching signatures:", err);
    res.status(500).json({ success: false, message: "Failed to fetch signatures" });
  }
};
exports.generateSignedPdf = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Load original document from DB
    const doc = await Document.findById(fileId);
    if (!doc) return res.status(404).json({ success: false, message: "Document not found" });

    const originalPath = path.join(__dirname, '../uploads', path.basename(doc.path));
    if (!fs.existsSync(originalPath)) return res.status(404).json({ success: false, message: "Original PDF not found" });

    const existingPdfBytes = fs.readFileSync(originalPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Get all signatures for this document
    const signatures = await Signature.find({ fileId });
    if (!signatures.length) return res.status(400).json({ success: false, message: "No signatures found" });

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    

    for (const sig of signatures) {
  const page = pdfDoc.getPage(sig.page - 1);
  const { width, height } = page.getSize();
  const pdfAspect = width / height;

  const savedAspect = sig.aspectRatio || 1; // fallback if missing
  const aspectCorrection = pdfAspect / savedAspect; 

  // Apply correction
  const correctedRelY = (1 - sig.y) * aspectCorrection;
  const absX = sig.x * width;
  const absY = sig.y * height;
  console.log(`**************************************************************Signature debug:
  PDF page ${sig.page} size: ${width}x${height}
  PDFAspect=${pdfAspect} aspectCorrection=${aspectCorrection}
  relativeX=${sig.x} relativeY=${sig.y} → absX=${absX} absY=${absY}`);

  page.drawText(sig.imageData, {
    x: absX,
    y: absY,
    size: 24,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
}

    // ✅ Now generate filename
    const signedFilename = `signed-${path.basename(doc.path)}`;
    const signedPath = path.join(__dirname, '../signed-uploads', signedFilename);
    const signedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(signedPath, signedPdfBytes);
    

    // ✅ Update the document only AFTER signedFilename is defined
    await Document.findByIdAndUpdate(fileId, {
      isSigned: true,
      signedFileUrl: `/signed-uploads/${signedFilename}`,
    });

    return res.status(200).json({ success: true, message: "Signed PDF generated", url: `/signed-uploads/${signedFilename}` });
  } catch (error) {
    console.error("Error generating signed PDF:", error);
    return res.status(500).json({ success: false, message: "Failed to generate signed PDF" });
  }
};
