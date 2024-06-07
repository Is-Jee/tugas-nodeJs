const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,  
  getUserProfileAdmin,
  updateUserProfileAdmin,
  deleteAdmin,
  authAdmin,
  getUserDetailAdmin
} = require("../controllers/adminController");

router.post("/auth", authAdmin)
router.post("/", loginAdmin);
router.post("/register", registerAdmin);
router.get("/profile", getUserProfileAdmin);
router.put("/profile/:id", updateUserProfileAdmin);
router.get("/profile/:id", getUserDetailAdmin)
router.delete("/delete/:id", deleteAdmin);

module.exports = router;
