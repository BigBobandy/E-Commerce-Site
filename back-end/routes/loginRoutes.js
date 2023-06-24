const express = require("express");
const router = express.Router();
const { login } = require("../controllers/loginControllers");

// Route for user login
router.post("/", login);

module.exports = router;
