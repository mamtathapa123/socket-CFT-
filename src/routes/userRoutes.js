const express = require("express");
const userController = require("../controller/userController");
const authenticateToken = require("../middleware/jwt");

const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.get("/user/:id", authenticateToken, userController.getUser);
router.put("/update-user", authenticateToken, userController.updateUser);
router.delete("/remove-user", authenticateToken, userController.removeUser);

module.exports = router;
