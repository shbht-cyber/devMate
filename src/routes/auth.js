const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { validateSignUpData } = require("../utils/validations");
const validator = require("validator");

const authRouter = express.Router();

// signup api
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    validateSignUpData(req);

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    await user.save();
    res.send("User registered successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Input validation
    if (!emailId || !password) {
      return res.status(400).json({
        error: "Both email and password are required",
      });
    }

    if (!validator.isEmail(emailId)) {
      return res.status(400).json({
        error: "User does not exist. Please sign up first.",
      });
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const token = await user.getJwt();
    res.cookie("token", token);

    res.status(200).json({
      message: "Login successful!",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        about: user.about,
        skills: user.skills,
        age: user.age,
        gender: user.gender,
        photoUrl: user.photoUrl,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.json({ message: "user logout successfully" });
});

module.exports = {
  authRouter,
};
