const express = require("express");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const fieldsToSend = [
  "firstName",
  "lastName",
  "age",
  "photoUrl",
  "gender",
  "skills",
  "about",
];

// get all pending connection requests for logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", fieldsToSend);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// get all the accepted connections for a logged in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // shobhit => virat => accepted
    // virat => dhoni => accepted
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", fieldsToSend)
      .populate("toUserId", fieldsToSend);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// paginated feed api
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    //pagination
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    // a logged in user should not see these cards
    //1. his own card
    //2. his connections
    //3. ignored cards
    //4. already sent the connection request

    const loggedInUser = req.user;

    //find all connection request (sent + received)
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });

    // hide own card
    hideUsersFromFeed.add(loggedInUser._id.toString());

    const feedUsers = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(fieldsToSend)
      .skip(skip)
      .limit(limit);

    res.send(feedUsers);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = {
  userRouter,
};
