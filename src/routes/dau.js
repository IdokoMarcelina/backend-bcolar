const express = require("express");
const User = require("../models/User");
const dauController = require("../controllers/dauContoller");

const router = express.Router();



router.post("/collect-dau", dauController.collectDAU);

module.exports = router;
