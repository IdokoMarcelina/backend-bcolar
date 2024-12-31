const Service = require('../models/Service')


const productPage = async (req, res)=>{
    try {
        const {productPic, title, category, description, date} = req.body

        const newService = new Service({productPic, title, category, description, date})

        const savedService = await newService.save()
        res.status(201).json(savedService)

    } catch (error) {
        console.error('Error posting service:', error);
        res.status(500).json({message: 'error posting service', error })
    }
}


const getAllService = async (req, res)=>{
    try {

        const Allservices = await Service.find()
        res.json(Allservices)
    } catch (error) {
        res.status(500).json({message: 'error finding services', error})
    }
}

module.exports ={
    productPage,
    getAllService
}