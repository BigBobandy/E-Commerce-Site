const express = require("express");
const router = express.Router();
const { getUserByUrlString } = require("../controllers/userControllers");

router.get("/:userUrlString", getUserByUrlString);

module.exports = router;
