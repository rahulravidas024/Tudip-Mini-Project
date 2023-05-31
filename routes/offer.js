const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");
const offerController = require("../controllers/offer");

router.post("/createOffer", middleware.authentication, offerController.createOffer);

router.get("/getOffer", middleware.authentication, offerController.getOffer);

router.put("/updateOffer", middleware.authentication, offerController.updateOffer);

router.delete("/deleteOffer", middleware.authentication, offerController.deleteOffer);

module.exports = router;
