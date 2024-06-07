const asyncHandler = require("express-async-handler");
const Products = require("../models/productsModels");
const Images = require("../models/imagesModels");
const path = require("path");
const fs = require("fs");

const addProducts = asyncHandler(async (req, res) => {
  const { title, timer, desc, harga, category, fitur_1, fitur_2, fitur_3 } = req.body;

  const image = req.file.path;

  const titleExists = await Products.findOne({ title });

  if (titleExists) {
    res.status(400);
    throw new Error("Title already exists");
  }

  const products = await Products.create({
    title,
    image,
    desc,
    timer,
    harga,
    category,
    fitur_1,
    fitur_2,
    fitur_3
  });

  res.status(201).json({
    id: products._id,
    title: products.title,
    desc: products.desc,
    image: products.image,
    harga: products.harga,
    category: products.category,
  });
});

const getProducts = asyncHandler(async (req, res) => {
  const products = await Products.find({});

  res.status(200).json(products);
});

const getProductsDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const products = await Products.findById(id);
  const images = await Images.find({ product_ID: id });

  if (!products) {
    res.status(404);
    throw new Error("products not found");
  }

  res.status(200).json({
    products,
    images,
  });
});

const updateProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const products = await Products.findById(id);

  if (products) {
    products.title = req.body.title || products.title;
    products.desc = req.body.desc || products.desc;
    products.harga = req.body.harga || products.harga;
    products.fitur_1 = req.body.fitur_1 || products.fitur_1;
    products.fitur_2 = req.body.fitur_2 || products.fitur_2;
    products.fitur_3 = req.body.fitur_3 || products.fitur_3;
    products.category = req.body.category || products.category;

    if (req.file) {
      removeImage(products.image);

      products.image = req.file.path;
    }

    const updatedProducts = await products.save();

    res.status(200).json({
      id: updatedProducts._id,
      title: updatedProducts.title,
      image: updatedProducts.image,
      desc: updatedProducts.desc,
      harga: updatedProducts.harga,
      category: updatedProducts.category,
    });
  } else {
    res.status(404);
    throw new Error("Products not found");
  }
});

const deleteProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;

  Products.findById(id)
    .then(async (result) => {
      if (!result) {
        res.status(404);
        throw new Error("Product Not Found");
      }
      removeImage(result.image);
      await Products.findByIdAndRemove(id);
      return Images.find({ product_ID: id });
    })
    .then(async (result) => {
      if (result) {
        for (let data of result) {
          removeImage(data.images);
        }
        await Images.deleteMany({ product_ID: id });
      }
      res.status(200).json({ message: "Deleted Success" });
    })
    .catch((err) => {
      console.log(err);
    });
});

const removeImage = (filePath) => {
  filePath = path.join(__dirname, "../..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

module.exports = {
  addProducts,
  getProducts,
  getProductsDetail,
  updateProducts,
  deleteProducts,
};
