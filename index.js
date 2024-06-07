const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const productsRoutes = require("./src/routes/productsRoutes")
const bannerRoutes = require("./src/routes/bannerRoutes");
const imagesRoutes = require("./src/routes/imagesRoutes")
const pesananRoutes = require("./src/routes/pesananRoutes")
const adminRoutes = require("./src/routes/adminRoutes")
const waConfigRoutes = require("./src/routes/waConfigRoutes")
const multer = require("multer");
const path = require("path")
const cors = require("cors")

dotenv.config();

connectDB();

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use("/images", express.static(path.join(__dirname, "images")))
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single("image"))

const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/addimages", imagesRoutes)
app.use("/api/pesanans", pesananRoutes)
app.use("/api/admins", adminRoutes)
app.use("/api/waconfig", waConfigRoutes)

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});