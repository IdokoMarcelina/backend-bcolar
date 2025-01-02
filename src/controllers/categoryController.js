const express = require('express');
const Service = require('../models/Service'); 


const getByCategory = async (req, res)=>{


    try {
        const { category } = req.query; // Get category from query params
    
        // Validate input
        if (!category) {
          return res.status(400).json({ message: 'Category is required' });
        }
    
        // Query the Service collection
        const services = await Service.find({ category }).select('productPic title category description');
    
        if (services.length === 0) {
          return res.status(404).json({ message: 'No services found for this category' });
        }
    
        res.status(200).json(services);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching services', error });
      }


}
  


module.exports = getByCategory;
