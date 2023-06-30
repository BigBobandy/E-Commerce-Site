const express = require("express");
const router = express.Router();
const {
  resetPasswordEmail,
  verifyResetPasswordCode,
  updatePassword,
} = require("../controllers/passwordControllers");

// Route for sending a password reset email
router.post("/reset-password", resetPasswordEmail);

// Route for verifying the password reset code
router.post("/verify-reset-code", verifyResetPasswordCode);

// Route for updating the password
router.put("/update-password", updatePassword);

module.exports = router;
