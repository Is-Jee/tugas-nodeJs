const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter a Name"],
    },
    no_wa: {
      type: String,
      required: [true, "Please Enter a WhatsApp"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please Enter a valid Email"],
    },
    image: {
      type: String,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Please Enter Password"],
      minLength: [6, "Minimum password length is 6"]
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model("User", userSchema);
