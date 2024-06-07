const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter a Name"],
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

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model("Admin", adminSchema);
