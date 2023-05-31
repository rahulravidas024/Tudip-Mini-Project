const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");
const favoriteController = require("../controllers/favorite");

router.post("/addFavoriteProduct", middleware.authentication, favoriteController.addFavoriteProduct);

router.get("/getAllFavoriteProduct", middleware.authentication, favoriteController.getAllFavoriteProduct);

router.put("/removeFavoriteProduct", middleware.authentication, favoriteController.removeFavoriteProduct);

module.exports = router;
