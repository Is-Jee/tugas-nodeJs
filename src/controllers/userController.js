const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const path = require("path");
const fs = require("fs");
const { isEmail } = require("validator");
const jwt = require("jsonwebtoken");

const auth = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      res.json({
        auth: true,
        data: decoded,
      });
    } catch (err) {
      res.json({
        auth: false,
        data: err.message,
      });
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, no_wa } = req.body;
  const image = req.file?.path || "images\\avatar.png";

  if (name.trim().length === 0) {
    res.status(400);
    throw new Error("Please Enter a Name");
  }

  if (no_wa.trim().length === 0) {
    res.status(400);
    throw new Error("Please Enter a WhatsApp");
  } else if (no_wa.trim().length <= 10) {
    res.status(400);
    throw new Error("Please Enter a valid WhatsApp");
  }

  if (!isEmail(email)) {
    res.status(400);
    throw new Error("Please Enter a valid Email");
  }

  if (password.trim().length === 0) {
    res.status(400);
    throw new Error("Please Enter a Password");
  } else if (password.trim().length <= 5) {
    res.status(400);
    throw new Error("Minimum Password length is 6 characters");
  }

  const existingUser = await User.findOne({ email }).exec();

  if (existingUser) {
    res.status(400);
    throw new Error("Email Already Registered");
  }

  const user = await User.create({
    name,
    image,
    password,
    email,
    no_wa,
  });

  if (user) {
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        no_wa: user.no_wa,
        image: user.image,
      },
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
        email: user.email,
        no_wa: user.no_wa,
      },
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const login = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email }).exec();
  if (user) {
    if (await user.matchPassword(password)) {
      const token = jwt.sign(
        { id: user._id, name: user.name, no_wa: user.no_wa, email: user.email, image: user.image },
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
    throw new Error("No User Found with this Email");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.find({}).select("name image");

  res.status(200).json(user);
});

const getUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  res.status(200).json(user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;

    const userExists = await User.findOne({ name: user.name });

    if (userExists) {
      res.status(400);
      throw new Error("Username already exists");
    }

    if (req.file) {
      removeImage(user.image);

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

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then(async (result) => {
      if (!result) {
        res.status(404);
        throw new Error("User Not Found");
      }
      removeImage(result.image);
      await User.findByIdAndRemove(id);
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
  registerUser,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  auth,
  getUserId,
};
