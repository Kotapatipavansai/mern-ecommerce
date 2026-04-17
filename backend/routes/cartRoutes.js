const express = require("express");
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ ADD TO CART
router.post("/add", protect, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        items: [{ productId, quantity: 1 }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }

      await cart.save();
    }

    return res.status(201).json({ message: "Added to cart" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Cart error: ${err}` });
  }
});


// ✅ GET CART (IMPORTANT: populate)
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate("items.productId");

    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json({ message: `Cart fetch error: ${err}` });
  }
});

module.exports = router;