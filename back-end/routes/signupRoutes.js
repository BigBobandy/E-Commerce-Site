const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/authController");

// Route for user signup.
router.post("/", signup);

module.exports = router;
