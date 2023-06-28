const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const {
  getUserByUrlString,
  updateUser,
} = require("../controllers/userControllers");

// API request limiter
// The purpose of this is to prevent the user from abusing name-change requests
// If more than 5 name-change requests in a 15-minute window the server will respond with an error
const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
  handler: function (req, res, next) {
    res.status(429).json({
      error: "Too many requests, please try again later.",
      retryAfter: Date.now() + 15 * 60 * 1000, // retry after 15 minutes from now
    });
  },
});

router.get("/:userUrlString", getUserByUrlString);
router.put("/:userUrlString", limit, updateUser);

module.exports = router;
