const express = require("express");
const router = express.Router();
const {
  submitOrder,
  getOrderInfo,
} = require("../controllers/orderControllers");

router.post("/submit", submitOrder);

router.get("/get", getOrderInfo);

module.exports = router;
