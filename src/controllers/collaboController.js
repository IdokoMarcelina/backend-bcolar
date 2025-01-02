const Collabo = require('../models/Collabo')
const mongoose = require('mongoose');
const cloudinary = require("cloudinary").v2; 

const collaboPage = async (req, res) => {
  try {
    const { collaboPic, category, description, requirements, date } = req.body;

    if (!collaboPic || !category || !description || !requirements) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let cloudImage = null;

    try {
      cloudImage = await cloudinary.uploader.upload(collaboPic, {
        folder: "collaboPics", 
        resource_type: "image", 
      });
    } catch (error) {
      return res.status(500).json({ message: "Error uploading image to Cloudinary.", error: error.message });
    }

    const newCollabo = new Collabo({
      collaboPic: cloudImage.secure_url, 
      category,
      description,
      requirements,
      date,
      userId: req.user._id,
    });

    const savedCollabo = await newCollabo.save();

    res.status(201).json(savedCollabo);
  }  catch (error) {
    console.error('Error posting service:', error); 
    res.status(500).json({
      message: 'Error posting service',
      error: error.message || 'An unknown error occurred',
    });
  }
};

const getAllCollabo = async (req, res)=>{
    try {

        const AllCollabo = await Collabo.find()
        res.json(AllCollabo)
    } catch (error) {
        res.status(500).json({message: 'error finding services', error})
    }
}

const getArticanCollaboPost = async (req, res) => {
    try {
      const { artisanId } = req.params; 
  
      if (!mongoose.Types.ObjectId.isValid(artisanId)) {
        return res.status(400).json({ message: "Invalid artisan ID." });
      }
  
      const artisanCollabos = await Collabo.find({ userId: artisanId });
  
      if (artisanCollabos.length === 0) {
        return res.status(404).json({ message: "No collaboration posts found for this artisan." });
      }
  
      res.status(200).json(artisanCollabos);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving artisan collaboration posts.",
        error: error.message,
      });
    }
  };
  


module.exports = {
    collaboPage,
    getAllCollabo,
    getArticanCollaboPost
}