const express = require("express");
const router = express.Router();

const {
  postPesanan,
  getPesanan,
  getDetailPesanan,
  postDataPesanan,
  updateStatusPesanan,
} = require("../controllers/pesananController");

router.post("/", postPesanan);
router.post("/data", postDataPesanan);
router.put("/:id", updateStatusPesanan);
router.get("/", getPesanan);
router.get("/:id", getDetailPesanan);

module.exports = router;
