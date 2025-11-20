const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { validateSignUpData } = require("../utils/validations");
const validator = require("validator");
const upload = require("../utils/multer");

const authRouter = express.Router();

// signup api
authRouter.post("/signup", upload.single("photo"), async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, gender, age } = req.body;
    validateSignUpData(req);

    const photoUrl = req.file.path;

    let userDefaultPhoto = "";
    if (!photoUrl) {
      userDefaultPhoto =
        gender.toLowerCase() == "female"
          ? "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-female-9.png"
          : "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png";
    } else {
      userDefaultPhoto = photoUrl;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      gender,
      photoUrl: userDefaultPhoto,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJwt();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 24 * 3600000),
    });

    res.status(200).json({
      message: "Registration successful!",
      data: {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        emailId: savedUser.emailId,
        about: savedUser.about,
        skills: savedUser.skills,
        age: savedUser.age,
        gender: savedUser.gender,
        photoUrl: savedUser.photoUrl,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message || "Internal server error. Please try again later.",
    });
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
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      message: "Login successful!",
      data: {
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

  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });

  res.json({ message: "user logout successfully" });
});

module.exports = {
  authRouter,
};
