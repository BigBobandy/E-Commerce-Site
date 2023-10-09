const express = require("express");
const router = express.Router();
const {
  submitOrder,
  getOrderInfo,
} = require("../controllers/orderControllers");

router.post("/submit-order", submitOrder);

router.get("/get-order-info", getOrderInfo);

module.exports = router;
