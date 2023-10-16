const express = require("express");
const { limit } = require("../utils/rateLimit");
const router = express.Router();
const {
  getUserShippingInfo,
  setDefaultAddress,
  addAddress,
  deleteAddress,
} = require("../controllers/shippingInfoControllers");

// Got all the CRUD in this one!

router.get("/get-shipping-info", getUserShippingInfo);

router.patch("/default-address", limit, setDefaultAddress);

router.post("/add-address", addAddress);

router.delete("/delete-address/:addressId", deleteAddress);

module.exports = router;
