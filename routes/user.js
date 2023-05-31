const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const middleware = require("../middleware/auth");

router.post("/createUser", userController.createUser);

router.get("/getAllUser", userController.getALlUser);

router.get("/getUserByQueryString", userController.getUserByQueryString);

router.get("/getUserByQueryParams/:userId", userController.getUserByQueryParams);

router.get("/getUserByLimit", userController.getUserByLimit);

router.put("/updateUser/:userId", middleware.authentication, userController.updateUser);

router.put("/deleteUser/:userId", middleware.authentication, userController.deleteUser);

router.get("/getUser", userController.getFilteredUser);

router.post("/login", userController.login);

router.get("/verifyEmail/:userId", userController.verifyEmail);

module.exports = router;
