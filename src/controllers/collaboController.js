const Collabo = require('../models/Collabo')
const Application = require("../models/Application");
const mongoose = require('mongoose');
const cloudinary = require("cloudinary").v2; 

const collaboPage = async (req, res) => {
  try {
    const { category, description, requirements, date } = req.body;
    const collaboPic= req.file
    console.log(req.file)

    if (req.user.user_type !== 'artisan') {
      console.log("User Role:", req.user.user_type); 
      return res.status(403).json({ message: "Access denied. Only artisans can post a collabo." });
    }

    if (!collaboPic || !category || !description || ! requirements ) {
      console.log(collaboPic)
      return res.status(400).json({ message: "All fields are required." });
    }

    let cloudImage = null

    try {
      cloudImage = await cloudinary.uploader.upload(req.file.path,{
        // folder: "collaboPics", 
        // resource_type: "image", 
      })
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

    res.status(200).json({savedCollabo, success: true});
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

  const viewSpecificCollabo = async (req, res) => {
    try {
      const { id } = req.params;

      const collabo = await Collabo.findOne({ _id: id, userId: req.user._id });
  
      console.log(`Fetching collabo for artisan ID: ${req.user._id} with collabo ID: ${id}`);
  
      if (!collabo) {
        return res.status(404).json({ message: 'Collabo not found' });
      }
  
      res.status(200).json(collabo);
    } catch (error) {
      console.error('Error fetching collabo:', error);
      res.status(500).json({ message: 'An error occurred while fetching the collabo.' });
    }
  };
  

  const applyForCollabo = async (req, res) => {
    try {
        const { id } = req.params; // Collabo ID
        const userId = req.user._id; // User applying for collabo

        const collabo = await Collabo.findById(id);
        if (!collabo) {
            return res.status(404).json({ message: "Collabo not found" });
        }

        // Check if the user has already applied
        const alreadyApplied = collabo.applicants.some(applicant => applicant.userId.toString() === userId.toString());
        if (alreadyApplied) {
            return res.status(400).json({ message: "You have already applied for this collabo" });
        }

        // Add user to applicants list
        collabo.applicants.push({ userId });
        await collabo.save();

        res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
        console.error("Error applying to collabo:", error);
        res.status(500).json({ message: "An error occurred while applying to the collabo." });
    }
};


const viewApplicationProfile = async (req, res) => {
  try {
      const { collaboId } = req.params;

      const collabo = await Collabo.findById(collaboId).populate("applicants.userId", "name email phone avatar");
      if (!collabo) {
          return res.status(404).json({ message: "Collabo not found" });
      }

      res.status(200).json({ applicants: collabo.applicants });
  } catch (error) {
      console.error("Error fetching application profiles:", error);
      res.status(500).json({ message: "An error occurred while fetching applications." });
  }
};



const deleteCollabo = async (req, res) => {
    try {
      const { collaboId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(collaboId)) {
        return res.status(400).json({ message: 'Invalid collaboration ID.' });
      }
  
      const deletedCollabo = await Collabo.findByIdAndDelete(collaboId);
  
      if (!deletedCollabo) {
        return res.status(404).json({ message: 'Collaboration not found.' });
      }
  
      res.status(200).json({ message: 'Collaboration deleted successfully.' });
    } catch (error) {
      console.error('Error deleting collaboration:', error.message);
      res.status(500).json({
        message: 'Error deleting collaboration.',
        error: error.message,
      });
    }
  };


const viewCollaboApplicants = async (req, res) => {
  try {
    const { collaboId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(collaboId)) {
      return res.status(400).json({ message: "Invalid Collabo ID." });
    }

    // Fetch all applications where collaboId matches
    const applicants = await Application.find({ collaboId }).populate(
      "applicantId",
      "name email avatar bio skill about"
    );

    if (!applicants.length) {
      return res.status(404).json({ message: "No applicants found for this Collabo." });
    }

    res.status(200).json(applicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "An error occurred while fetching applicants." });
  }
};

  


module.exports = {
    collaboPage,
    getAllCollabo,
    getArticanCollaboPost,
    viewSpecificCollabo,
    applyForCollabo,
    viewApplicationProfile,
    viewCollaboApplicants,
    deleteCollabo
}