const express = require("express");
const { strictLimit } = require("../utils/rateLimit");
const router = express.Router();
const { sendContactEmail } = require("../controllers/contactUsController");

router.post("/send-contact", strictLimit, sendContactEmail);

module.exports = router;
