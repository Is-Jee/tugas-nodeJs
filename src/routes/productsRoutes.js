const express = require("express");
const router = express.Router();
const {
  addProducts,
  getProducts,
  getProductsDetail,
  updateProducts,
  deleteProducts,
} = require("../controllers/productsController");

router.post("/", addProducts);
router.get("/", getProducts);
router.get("/:id", getProductsDetail);
router.put("/:id", updateProducts);
router.delete("/:id", deleteProducts);

module.exports = router;
