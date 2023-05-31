const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review");
const middleware = require("../middleware/auth");

router.post("/createReview", middleware.authentication, reviewController.createReview);

router.get("/getReview", middleware.authentication, reviewController.getReview);

router.put("/updateReview", middleware.authentication, reviewController.updateReview);

router.delete("/deleteReview", middleware.authentication, reviewController.deleteReview);

module.exports = router;
