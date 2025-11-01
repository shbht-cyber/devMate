const express = require("express");

const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

// send connection request api
requestRouter.get("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  res.send(user.firstName + " sent connection request");
});

module.exports = {
  requestRouter,
};
