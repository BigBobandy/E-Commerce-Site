const express = require("express");
const router = express.Router();
const {
  resetPasswordEmail,
  verifyResetPasswordCode,
  updatePassword,
  resendResetPasswordEmail,
} = require("../controllers/passwordControllers");

// Route for sending a password reset email
router.post("/reset-password", resetPasswordEmail);

// Route for verifying the password reset code
router.post("/verify-reset-code", verifyResetPasswordCode);

// Route for updating the password
router.put("/update-password", updatePassword);

// Route for re-sending the password reset email
router.post("/resend-reset-password-email", resendResetPasswordEmail);

module.exports = router;
