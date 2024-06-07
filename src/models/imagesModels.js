const mongoose = require("mongoose");

const imagesSchema = mongoose.Schema({
  images: {
    type: String,
    required: true
  },
  product_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products"
  }
})

imagesSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });  

module.exports = mongoose.model("Product_Image", imagesSchema);