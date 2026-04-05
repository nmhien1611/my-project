const express = require("express");
const router = express.Router();

const {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const { auth } = require("../middleware/auth");

router.get("/", auth, getMyCart);
router.post("/", auth, addToCart);
router.put("/:itemId", auth, updateCartItem);
router.delete("/:itemId", auth, removeCartItem);
router.delete("/", auth, clearCart);

module.exports = router;
