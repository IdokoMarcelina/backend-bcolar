const Service = require('../models/Service')
const mongoose = require('mongoose');
const cloudinary = require("cloudinary").v2; 

const productPage = async (req, res) => {
  try {
    const { name, category, region, date } = req.body;
    const productPic = req.file;

    if (req.user.user_type !== 'artisan') {
      console.log("User Role:", req.user.user_type); 
      return res.status(403).json({ message: "Access denied. Only artisans can post a service." });
    }

    if (!productPic || !name || !category || !region) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let cloudImage = null;

    try {
      cloudImage = await cloudinary.uploader.upload(req.file.path, {
        // folder: "productPics",
        // resource_type: "image",
      });
    } catch (error) {
      return res.status(500).json({ message: "Error uploading image to Cloudinary.", error: error.message });
    }

    const newService = new Service({
      productPic: cloudImage.secure_url,
      name,
      category,
      region,
      date,
      userId: req.user._id,
    });

    const savedService = await newService.save();

    res.status(200).json({ savedService, success: true });
  } catch (error) {
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
    const artisanId = req.params;

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