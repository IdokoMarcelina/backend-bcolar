const mongoose = require("mongoose");

const dauSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true }, 
    activeUsers: { type: Number, required: true },
    newRegistrations: { type: Number, required: true },
  },
  { timestamps: true }
);

const DAU = mongoose.model("DAU", dauSchema);

module.exports = DAU;
