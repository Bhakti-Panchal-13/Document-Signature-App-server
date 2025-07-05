const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  signer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  page: { type: Number, required: true },
  imageData: { type: String, required: true }, // text or image of the signature
  status: {
    type: String,
    enum: ["pending", "signed"],
    default: "pending",
  },
  aspectRatio: Number,
}, { timestamps: true });

module.exports = mongoose.model("Signature", signatureSchema);

