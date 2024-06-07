const asyncHandler = require("express-async-handler");
const Pesanans = require("../models/pesananModels");

const postPesanan = asyncHandler(async (req, res) => {
  const {
    customer_id,
    status,
    sub_total,
    waktu_sewa,
    profile_user,
    customer_name,
    customer_email,
    customer_wa,
  } = req.body;

  const pesanan = await Pesanans.create({
    customer_id,
    status,
    waktu_sewa,
    profile_user,
    customer_name,
    sub_total,
    customer_email,
    customer_wa,
  });

  res.status(201).json({
    pesanan,
  });
});

const postDataPesanan = asyncHandler(async (req, res) => {
  const {
    customer_id,
    title,
    id,
    category,
    product_id,
    image,
    harga,
    quantity,
  } = req.body;

  if (!customer_id) {
    res.status(404);
    throw new Error("Customer Tidak Ada");
  }

  const pesanan = {
    title,
    image,
    category,
    product_id,
    harga,
    quantity,
  };

  await Pesanans.findOneAndUpdate(
    { customer_id, _id: id },
    { $push: { pesanan: pesanan } },
    { new: true }
  );

  res.status(201).json({ message: "Success" });
});

const getPesanan = asyncHandler(async (req, res) => {
  const pesanan = await Pesanans.find({});

  res.status(200).json(pesanan);
});

const getDetailPesanan = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pesanan = await Pesanans.findById(id);

  if (!pesanan) {
    res.status(404);
    throw new Error("Pesanan Tidak Ada");
  }

  res.status(200).json(pesanan);
});

const updateStatusPesanan = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Pesanans.findByIdAndUpdate(id, { status: "success" });

  res.status(201).json({ message: "Success" });
});

module.exports = {
  postPesanan,
  getPesanan,
  getDetailPesanan,
  updateStatusPesanan,
  postDataPesanan,
};
