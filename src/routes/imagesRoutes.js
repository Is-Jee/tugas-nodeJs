const express = require("express");
const router = express.Router();
const {postImages} = require("../controllers/imagesProduct")

router.post("/:id", postImages)

module.exports = router