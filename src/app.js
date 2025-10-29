const express = require("express");
const { checkAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", checkAuth);

app.get("/admin", (req, res) => {
  console.log("/admin get success");
  res.send("get all admin");
});

app.listen(3000, () => console.log("server started at port 3000"));
