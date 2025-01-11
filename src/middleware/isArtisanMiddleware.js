const User = require('../models/User')


const IsArtisan = async (req,res)=>{
    try {
        if(req.user && req.role === "artisans")
            return next();
    } catch (error) {
        
    }
}


module.exports = {
    IsArtisan
}