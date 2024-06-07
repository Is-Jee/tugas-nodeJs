const mongoose = require("mongoose");

const dataPesananSchema = mongoose.Schema({
  product_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["fullset", "populer"],
    default: "populer",
  },
  image: {
    type: String,
    required: true,
  },
  harga: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const pesanansSchema = mongoose.Schema(
  {
    customer_id: {
      type: String,
      required: true,
    },
    profile_user: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      required: true
    },
    customer_wa: {
      type: String,
      required: true
    },
    customer_name: {
      type: String,
      required: true,
    },
    pesanan: [dataPesananSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "success"],
      default: "pending",
    },
    waktu_sewa: {
      type: String,
      enum: ["24 Jam", "48 Jam", "72 Jam", "96 Jam"],
      default: "24 Jam",
    },
    sub_total: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

pesanansSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model("Pesanans", pesanansSchema);
