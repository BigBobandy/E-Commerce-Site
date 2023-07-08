const rateLimit = require("express-rate-limit");

// Request limiter
const limit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  handler: function (req, res, next) {
    res.status(429).json({
      error: "Too many requests, please try again in a few minutes.",
    });
  },
});
module.exports = limit;
