const mongoose = require("mongoose");

const productsSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  harga: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["fullset", "populer"],
    default: "populer",
  },
  fitur_1: {
    type: String,
  },
  fitur_2: {
    type: String,
  },
  fitur_3: {
    type: String,
  },
});

productsSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model("Products", productsSchema);
