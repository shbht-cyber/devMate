const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");

const profileRouter = express.Router();

// get profile api
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

//edit profile api
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) throw new Error("Invalid edit request");

    const loggedInUser = req.user;

    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field])
    );
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile has beed updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    throw res.status(400).send("Error: " + err.message);
  }
});

// get profile api
profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both fields are required" });
    }

    const loggedInUser = req.user;

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new password cannot be the same" });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res
        .status(400)
        .json({ error: "New password is not strong enough" });
    }

    const isCurrentPasswordCorrect = await loggedInUser.validatePassword(
      currentPassword
    );
    if (!isCurrentPasswordCorrect) {
      return res
        .status(400)
        .json({ error: "Incorrect current password. Try again." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = hashedPassword;
    await loggedInUser.save();

    res.json({
      message: "Password updated successfully!",
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
});

module.exports = {
  profileRouter,
};
