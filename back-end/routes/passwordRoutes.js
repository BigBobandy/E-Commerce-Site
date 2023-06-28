const express = require("express");
const router = express.Router();
const { resetPasswordEmail } = require("..//controllers/passwordControllers");

router.post("/reset-password", resetPasswordEmail);

module.exports = router;
