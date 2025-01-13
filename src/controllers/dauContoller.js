const DAU = require("../models/DAU");
const User = require("../models/User");

const collectDAU = async (req, res) => {
  const currentDate = new Date().toISOString().split("T")[0]; // Format: "YYYY-MM-DD"

  try {
    const activeUserCount = await User.countDocuments({
      lastLogin: { $gte: new Date(currentDate) },
    });

    const existingDAU = await DAU.findOne({ date: currentDate });

    if (existingDAU) {
      existingDAU.activeUsers = activeUserCount;
      await existingDAU.save();
    } else {
      const newDAU = new DAU({
        date: currentDate,
        activeUsers: activeUserCount,
      });
      await newDAU.save();
    }

    res.status(200).json({ message: "DAU data collected successfully" });
  } catch (error) {
    console.error("Error collecting DAU data:", error);
    res.status(500).json({ message: "Error collecting DAU data" });
  }
};

const getDau =  async (req, res) => {
    try {
      const dauData = await DAU.find();  // Fetch all DAU records
      res.status(200).json(dauData);  // Return the data as a response
    } catch (error) {
      res.status(500).json({ message: "Error fetching DAU data" });
    }
  };

module.exports = { collectDAU ,getDau};
