const express = require("express");
const router = express.Router();
const {
  signup,
  resendConfirmationEmail,
  createGuest,
} = require("../controllers/signupControllers");

// Route for user signup and account creation.
router.post("/", signup);

// Route for creating a guest in the database
router.post("/createGuest", createGuest);

// Route for re-sending the email confirmation email
router.post("/resend-confirmation-email", resendConfirmationEmail);

module.exports = router;
