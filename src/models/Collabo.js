const mongoose = require('mongoose')

const collaboSchema = new mongoose.Schema({
    collaboPic: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        
    },


})

module.exports = new mongoose.model('collabo', collaboSchema)