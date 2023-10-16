const express = require("express");
const { limit } = require("../utils/rateLimit");
const router = express.Router();
const {
  createCardInfo,
  getCardInfo,
  setDefaultCard,
  deleteCard,
} = require("../controllers/billingInfoControllers");

// All CRUD operations for billing info

router.get("/get-card-info", getCardInfo);

router.patch("/default-card", limit, setDefaultCard);

router.post("/create-card", createCardInfo);

router.delete("/delete-card/:cardId", deleteCard);

module.exports = router;
