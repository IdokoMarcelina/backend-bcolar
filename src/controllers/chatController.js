const Chat = require('../models/Chat')


const createChat = async (req, res)=>{

    const {firstId, secondId} = req.body

    try {
        const chat = await Chat.findOne({
            members: {$all: [firstId, secondId]}
        });
        if (chat) return res.status(200).json(chat)

        const newChat = new Chat({
            members: [firstId, secondId]
        }) 

      const response = await  newChat.save()

      res.status(200).json(response)
    } catch (error) {
        console.log(error);
        
        res.status(500).json(error)
    }
}


const findUserChats = async (req, res)=>{
    const userId = req.params

    try {
        const chats = Chat.find({
            members: {$in: [firstId, secondId]}
        })
        res.status(200).json(chats)
    } catch (error) {
        console.log(error);
        
        res.status(500).json(error)
    }
}

module.exports = {
    createChat,
    findUserChats
}