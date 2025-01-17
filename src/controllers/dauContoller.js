const DAU = require("../models/DAU");
const User = require("../models/User");

const collectDAU = async (req, res) => {
  const currentDate = new Date().toISOString().split("T")[0]; 

  try {
    
    const activeUserCount = await User.countDocuments({
      lastLogin: { $gte: new Date(currentDate) },
    });

    
    const newRegistrationCount = await User.countDocuments({
      created_at: { $gte: new Date(currentDate), $lt: new Date(currentDate).setHours(23, 59, 59, 999) },
    });

    const existingDAU = await DAU.findOne({ date: currentDate });

    if (existingDAU) {
      existingDAU.activeUsers = activeUserCount;
      existingDAU.newRegistrations = newRegistrationCount; 
      await existingDAU.save();
    } else {
      const newDAU = new DAU({
        date: currentDate,
        activeUsers: activeUserCount,
        newRegistrations: newRegistrationCount,
      });
      await newDAU.save();
    }

    // res.status(200).json({ message: "DAU data collected successfully" });
  } catch (error) {
    console.error("Error collecting DAU data:", error);
    res.status(500).json({ message: "Error collecting DAU data" });
  }
};

const getDau = async (req, res) => {
  try {
    const dauData = await DAU.find();
    res.status(200).json(dauData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching DAU data" });
  }
};

module.exports = { collectDAU, getDau };
