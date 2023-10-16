const rateLimit = require("express-rate-limit");

// Normal request limiter
const limit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  handler: function (req, res, next) {
    res.status(429).json({
      error: "Too many requests, please try again in a few minutes.",
    });
  },
});

// Strict request limiter
const strictLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2, // limit each IP to 2 requests per windowMs
  handler: function (req, res, next) {
    res.status(429).json({
      error: "Too many requests, please try again later.",
    });
  },
});

module.exports = { limit, strictLimit };
