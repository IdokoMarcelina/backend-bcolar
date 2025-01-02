const Service = require('../models/Service')
const mongoose = require('mongoose');
const cloudinary = require("cloudinary").v2; 

const productPage = async (req, res) => {
  try {
    const { productPic, title, category, description, date } = req.body;

    if (!productPic || !title || !category || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let cloudImage = null;

    try {
      cloudImage = await cloudinary.uploader.upload(productPic, {
        folder: "productPics", 
        resource_type: "image", 
      });
    } catch (error) {
      return res.status(500).json({ message: "Error uploading image to Cloudinary.", error: error.message });
    }

    const newService = new Service({
      productPic: cloudImage.secure_url, 
      title,
      category,
      description,
      date,
      userId: req.user._id,
    });

    const savedService = await newService.save();

    res.status(201).json(savedService);
  }  catch (error) {
    console.error('Error posting service:', error); 
    res.status(500).json({
      message: 'Error posting service',
      error: error.message || 'An unknown error occurred',
    });
  }
};




const getAllService = async (req, res)=>{
    try {

        const Allservices = await Service.find()
        res.json(Allservices)
    } catch (error) {
        res.status(500).json({message: 'error finding services', error})
    }
}



const getArtisanPosts = async (req, res) => {
  try {
    const artisanId = req.user._id;

    const artisanObjectId = new mongoose.Types.ObjectId(artisanId);

    const artisanPosts = await Service.find({ userId: artisanObjectId });

    console.log("Artisan Posts:", artisanPosts);

    res.status(200).json(artisanPosts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ message: "Error retrieving posts", error: error.message });
  }
};

const deleteArtisanPost = async (req, res) => {
    try {
      const postId = req.params.id;
  
      const post = await Service.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }
  
      if (post.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to delete this post.' });
      }
  
      await Service.findByIdAndDelete(postId);
  
      res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Error deleting post.', error: error.message });
    }
  };

module.exports ={
    productPage,
    getAllService,
    getArtisanPosts,
    deleteArtisanPost,
}