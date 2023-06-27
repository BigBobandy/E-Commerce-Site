const express = require("express");
const router = express.Router();
const { confirm, confirmCode } = require("../controllers/confirmControllers");

// Route for handling manual email confirmation
router.post("/", confirm);

// Route for confirming a user's email when they click on the confirmation link provided in the email.
router.get("/:codeParam", confirmCode);

module.exports = router;
