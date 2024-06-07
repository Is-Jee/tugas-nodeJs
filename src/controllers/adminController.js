const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModels");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const authAdmin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      res.json({
        authAdmin: true,
        data: decoded,
      });
    } catch (err) {
      res.json({
        authAdmin: false,
        data: err.message,
      });
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const image = req.file?.path || "images\\avatar-admin.jpg";

  const existingUser = await Admin.findOne({ name }).exec();

  if (existingUser) {
    res.status(400);
    throw new Error("Name Already Registered");
  }

  const user = await Admin.create({
    name,
    image,
    password,
  });

  if (user) {
    const token = jwt.sign(
      { id: user._id, name: user.name, image: user.image },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(201).json({
      message: "Account Created Successfully",
      user: {
        id: user._id,
        name: user.name,
        image: user.image,
      },
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { password, name } = req.body;

  const user = await Admin.findOne({ name }).exec();
  if (user) {
    if (await user.matchPassword(password)) {
      const token = jwt.sign(
        { id: user._id, name: user.name, image: user.image },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.status(201).json({
        message: "Login Successful",
        token,
      });
    } else {
      res.status(401);
      throw new Error("Invalid Password");
    }
  } else {
    res.status(400);
    throw new Error("No User Found with this Name");
  }
});

const getUserProfileAdmin = asyncHandler(async (req, res) => {
  const user = await Admin.find({}).select("name image");

  res.status(200).json(user);
});

const getUserDetailAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await Admin.findById(id).select("name image");

  res.status(200).json(user);
});

const updateUserProfileAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await Admin.findById(id);

  if (user) {
    user.name = req.body.name || user.name;

    if (req.file) {
      if (user.image !== "images\\avatar-admin.jpg") {
        removeImage(user.image);
      }
      user.image = req.file.path;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      image: user.image,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  Admin.findById(id)
    .then(async (result) => {
      if (!result) {
        res.status(404);
        throw new Error("User Not Found");
      }
      if (result.image !== "images\\avatar-admin.jpg") {
        removeImage(result.image);
      }
      await Admin.findByIdAndRemove(id);
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
  registerAdmin,
  loginAdmin,
  getUserProfileAdmin,
  updateUserProfileAdmin,
  deleteAdmin,
  authAdmin,
  getUserDetailAdmin,
};
