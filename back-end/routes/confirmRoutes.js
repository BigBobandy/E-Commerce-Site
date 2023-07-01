const express = require("express");
const router = express.Router();
const { confirm } = require("../controllers/confirmControllers");

// Route for handling manual email confirmation
router.post("/", confirm);

module.exports = router;
