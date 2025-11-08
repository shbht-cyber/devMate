const mongoose = require("mongoose");
const validator = require("validator");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },

    lastName: {
      type: String,
      required: true,
      maxLength: 15,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
    },

    gender: {
      type: String,
      lowercase: true,
      required: true,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender (male , female and other)",
      },
    },

    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("please provide a valid photo url");
        }
      },
    },

    about: {
      type: String,
      default: "in search of some developer friend",
      maxLength: 500,
    },

    skills: {
      type: [String],
      validate(skills) {
        if (skills.length > 20) throw new Error("skills cant be more than 20");

        const allValidLength = skills.every((skill) => skill.length <= 15);
        if (!allValidLength)
          throw new Error("individual skill length cant be more than 15");
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJwt = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "DEVMATEShobhit@911830", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const hashedPassword = this.password;

  const isValidPassword = await bcrypt.compare(
    passwordInputByUser,
    hashedPassword
  );

  return isValidPassword;
};

module.exports = mongoose.model("User", userSchema);
