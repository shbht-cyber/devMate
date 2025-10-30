const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

const port = 3000;

app.post("/signup", async (req, res) => {
  const userObject = {
    firstName: "Shobhit2",
    lastName: "Rajvanshi2",
    emailId: "shobhitraj1998@gmail.com2",
    password: "Shobhit@1232",
    age: 27,
    gender: "male",
  };

  const user = new User(userObject);

  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Not able to add user", err);
  }
});

connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(port, () => console.log(`server started at port ${port}`));
  })
  .catch((err) => console.log("database cant be connected", err));
