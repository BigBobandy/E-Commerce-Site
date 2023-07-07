const express = require("express");
const router = express.Router();
const {
  getUserShippingInfo,
  setDefaultAddress,
  addAddress,
  deleteAddress,
} = require("../controllers/shippingInfoControllers");

// Got all the CRUD in this one!

router.get("/get-shipping-info", getUserShippingInfo);

router.put("/default-address", setDefaultAddress);

router.post("/add-address", addAddress);

router.delete("/delete-address", deleteAddress);

module.exports = router;
