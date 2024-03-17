const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    userId: String,
    name: String,
    firstname: String,
    lastname: String,
    middlename: String,
    phone_number: String,

    picture: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    email: {
      type: String,
      unique: true,
    },

    role: {
      type: String,
      enum: ["admin", "user", "super-admin"],
      default: "user",
    },
    password: String,
    isEmailVerified: {
      type: String,
      enum: [true, false],
      default: false,
    },
    refreshToken: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatched = await bcrypt.compare(candidatePassword, this.password);
    return isMatched;
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
