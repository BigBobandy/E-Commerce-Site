const express = require("express");
const router = express.Router();
const { login, validateToken } = require("../controllers/loginControllers");

// Route for user login
router.post("/", login);

// Route for validating a token
router.post("/validate-token", validateToken);

module.exports = router;
