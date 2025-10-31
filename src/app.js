const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

const port = 3000;

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("something went wrong , not able to add user" + err);
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.emailId });
    if (user.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const allowedKeysForUpdates = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdatesAllowed = Object.keys(req.body).every((key) =>
      allowedKeysForUpdates.includes(key)
    );

    if (!isUpdatesAllowed) {
      throw new Error("Updates not allowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("cant add skills more than 10");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });
    res.send(user);
  } catch (err) {
    res.status(400).send("update failed" + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(port, () => console.log(`server started at port ${port}`));
  })
  .catch((err) => console.log("database cant be connected", err));
