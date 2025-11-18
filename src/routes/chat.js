const express = require("express");

const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");

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
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });

      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching messages.",
      error: err.message,
    });
  }
});

module.exports = { chatRouter };
