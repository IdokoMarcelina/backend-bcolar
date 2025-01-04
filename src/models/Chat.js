const { default: mongoose } = require("mongoose")


const chatSchema = new mongoose.Schema({
    
        members:{ 
            type: Array,
        },

        createdAt: {
            type: Date,
            default: Date.now,
          },


})

module.exports =  mongoose.model('Chat', chatSchema)