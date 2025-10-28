const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("this is root route");
});

app.use("/profile", (req, res) => {
  res.send("this is profile route");
});

app.use("/about", (req, res) => {
  res.send("this is about route");
});

app.listen(3000, () => console.log("server started on port 3000"));
