const express = require("express");
const router = express.Router();
const {
  signup,
  resendConfirmationEmail,
} = require("../controllers/signupControllers");

// Route for user signup and account creation.
router.post("/", signup);

// Route for re-sending the email confirmation email
router.post("/resend-confirmation-email", resendConfirmationEmail);

module.exports = router;
