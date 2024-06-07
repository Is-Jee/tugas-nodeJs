const asyncHandler = require("express-async-handler");
const Products = require("../models/productsModels");
const Images = require("../models/imagesModels");

const postImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const products = await Products.findById(id);
  const imagess = await Images.find({ product_ID: id });

  if(imagess.length === 4) {
    res.status(422)
    throw new Error("Posting Images Maks 5")
  }

  if (!products) {
    res.status(404)
    throw new Error("id not found");
  }

  if (!req.file) {
    res.status(422);
    throw new Error("Image must be uploaded");
  }

  const images = req.file.path;

  await Images.create({
    images,
    product_ID: products,
  });

  res.status(201).json({
    message: "Succes Add Image",
  });
});

module.exports = { postImages };
