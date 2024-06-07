const express = require("express");
const router = express.Router();
const {
  addBanner,
  getBanner,
  deleteBanner,
} = require("../controllers/bannerController.js");

router.post("/", addBanner);
router.get("/", getBanner)  
router.delete("/:id", deleteBanner)

module.exports = router