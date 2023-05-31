const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");
const productController = require("../controllers/product");
const { imageFileUpload } = require("../services/uploadImage");

router.post("/createProduct", middleware.authentication, imageFileUpload, productController.createProduct);

router.get("/getAllProduct", productController.getAllProduct);

router.put("/updateProduct/:productId", middleware.authentication, productController.updateProduct);

router.get("/searchProduct", productController.searchProduct);

router.get("/sortProduct", productController.sortProduct);

router.delete("/deleteProduct", middleware.authentication, productController.deleteProduct);

module.exports = router;
