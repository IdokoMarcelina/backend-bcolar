const mongoose = require('mongoose')

const ServiceSchema = new mongoose.Schema({
    productPic: {
        type: String,
        required: true
    },
    title: {
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
    date:{
        type: Date,
        default: Date.now
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        
    },


})

module.exports = new mongoose.model('Service', ServiceSchema)