const express = require("express");

const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const User = require("../models/user");

const chatRouter = express.Router();

// get chat api
chatRouter.get("/user/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.params;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName photoUrl",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });

      await chat.save();
    }

    const sender = req.user;
    const receiver = await User.findOne({ _id: targetUserId });

    const data = {
      ...chat.toJSON(),
      receiver: {
        firstName: receiver.firstName,
        lastName: receiver.lastName,
        photoUrl: receiver.photoUrl,
      },
    };

    res.json(data);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching messages.",
      error: err.message,
    });
  }
});

module.exports = { chatRouter };
