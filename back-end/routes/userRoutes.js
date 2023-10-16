const express = require("express");
const { limit } = require("../utils/rateLimit");
const router = express.Router();
const {
  getUserByUrlString,
  updateUser,
} = require("../controllers/userControllers");

router.get("/:userUrlString", getUserByUrlString);

router.put("/:userUrlString/change-name", limit, updateUser);

module.exports = router;
