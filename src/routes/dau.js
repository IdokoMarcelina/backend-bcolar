const express = require("express");
const User = require("../models/User");
const dauController = require("../controllers/dauContoller");

const router = express.Router();



router.post("/collect-dau", dauController.collectDAU);
router.get("/getdau", dauController.getDau);

module.exports = router;
