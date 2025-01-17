const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  collaboId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collabo",
    required: true,
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  profile: {
    type: String, // Example: If storing a resume link or extra info
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Application", applicationSchema);
