const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
const middleware = require("../middleware/auth");

router.post("/createCart", middleware.authentication, cartController.createCart);

router.get("/getCart", middleware.authentication, cartController.getCart);

router.put("/updateCart", middleware.authentication, cartController.updateCart);

router.get("/sortCartProduct", middleware.authentication, cartController.sortCartProduct);

router.get("/searchProductInCart", middleware.authentication, cartController.searchProductInCart);

router.put("/deleteCart", middleware.authentication, cartController.deleteCart);

module.exports = router;
