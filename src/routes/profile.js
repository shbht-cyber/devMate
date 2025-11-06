const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");

const profileRouter = express.Router();

// get profile api
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    return res.status(200).json({
      success: true,
      message: "profile data has been fetched successfully!",
      data: {
        _id: loggedInUser._id,
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        emailId: loggedInUser.emailId,
        age: loggedInUser.age,
        gender: loggedInUser.gender,
        about: loggedInUser.about,
        skills: loggedInUser.skills,
        photoUrl: loggedInUser.photoUrl,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching profile.",
      error: err.message,
    });
  }
});

//edit profile api
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // Validate incoming data
    if (!validateEditProfileData(req)) {
      return res.status(400).json({
        success: false,
        message: "Invalid edit profile request. Please send valid data.",
      });
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field])
    );
    await loggedInUser.save();

    return res.status(200).json({
      success: true,
      message: `${loggedInUser.firstName}, your profile has been updated successfully.`,
      data: {
        _id: loggedInUser._id,
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        emailId: loggedInUser.emailId,
        age: loggedInUser.age,
        gender: loggedInUser.gender,
        about: loggedInUser.about,
        skills: loggedInUser.skills,
        photoUrl: loggedInUser.photoUrl,
      },
    });
  } catch (err) {
    console.error("Edit profile error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile.",
      error: err.message,
    });
  }
});

// edit password api
profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error:
          "Current password, new password and confirm passwords are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "New password and confirm password doesnt match",
      });
    }

    const loggedInUser = req.user;

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        error: "New password must be different from current password.",
      });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        error:
          "New password must be at least 8 characters long and include uppercase, lowercase, number & symbol.",
      });
    }

    const isCurrentPasswordCorrect = await loggedInUser.validatePassword(
      currentPassword
    );

    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = hashedPassword;
    await loggedInUser.save();

    return res.status(200).json({
      success: true,
      message: "Your password has been updated successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      detail: err.message,
    });
  }
});

module.exports = {
  profileRouter,
};
