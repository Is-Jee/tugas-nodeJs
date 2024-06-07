const express = require("express");
const router = express.Router();
const {
  registerUser,
  login,  
  getUserProfile,
  updateUserProfile,
  deleteUser,
  auth,
  getUserId
} = require("../controllers/userController");

router.post("/auth", auth)
router.post("/", login);
router.post("/register", registerUser);
router.get("/:id", getUserId);
router.route("/profile").get(getUserProfile).put(updateUserProfile);
router.delete("/delete/:id", deleteUser);

module.exports = router;
