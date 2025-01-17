const mongoose = require('mongoose')

const collaboSchema = new mongoose.Schema({
    collaboPic: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    date: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    applicants: [{ 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        appliedAt: { type: Date, default: Date.now }
    }]
});


module.exports = new mongoose.model('collabo', collaboSchema)