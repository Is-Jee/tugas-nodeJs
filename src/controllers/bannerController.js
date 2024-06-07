const asyncHandler = require("express-async-handler");
const Banner = require("../models/bannerModels");
const path = require("path");
const fs = require("fs")

const addBanner = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(422);
    throw new Error("Image must be uploaded");
  }

  const { title } = req.body;
  const image = req.file.path

  const banner = await Banner.create({
    title,
    image,
  });

  res.status(201).json({
    id: banner._id,
    title: banner.title,
    image: banner.image,
  });
});

const getBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.find({});

  res.status(200).json(banner);
})

const deleteBanner = asyncHandler(async (req, res) => {
  const {id} = req.params

  Banner.findById(id)
    .then(async result => {
      if (!result) {
        res.status(404);
        throw new Error("Image Not Found");
      }
      removeImage(result.image)
      await Banner.findByIdAndRemove(id)
      res.status(200).json({message: "Deleted Success"})
    })
    .catch(err => {
      console.log(err);
    })

})

const removeImage = filePath => {
  filePath = path.join( __dirname, "../..", filePath )
  fs.unlink(filePath, err => console.log(err))
}

module.exports = { addBanner, getBanner, deleteBanner };
