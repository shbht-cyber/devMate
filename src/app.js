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
    res.status(400).send("something went wrong , not able to add user", err);
  }
});

connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(port, () => console.log(`server started at port ${port}`));
  })
  .catch((err) => console.log("database cant be connected", err));
