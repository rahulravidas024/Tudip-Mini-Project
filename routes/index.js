const express = require("express");
const userRoute = require("./user");
const productRoute = require("./product");
const favoriteRoute = require("./favorite");
const offerRoute = require("./offer");
const cartRoute = require("./cart");
const reviewRoute = require("./review");

const router = express.Router();

router.use("/user", userRoute);
router.use("/product", productRoute);
router.use("/favorite", favoriteRoute);
router.use("/offer", offerRoute);
router.use("/cart", cartRoute);
router.use("/review", reviewRoute);

module.exports = router;
