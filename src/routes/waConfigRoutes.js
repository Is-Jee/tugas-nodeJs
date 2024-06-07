const express = require("express");
const router = express.Router();
const {
  addToken,
  getToken
} = require("../controllers/waConfigController.js");

router.put("/", addToken);
router.get("/", getToken);

module.exports = router