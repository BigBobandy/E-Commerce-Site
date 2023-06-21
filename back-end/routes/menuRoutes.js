const express = require("express");
const router = express.Router();
const { getAll } = require("../controllers/menuController");

// Route for fetching all menu items
router.get("/", getAll);

module.exports = router;
