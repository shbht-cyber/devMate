const express = require("express");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/database");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/requests");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("database connected successfully!!");
    app.listen(port, () => console.log(`server started at port ${port}`));
  })
  .catch((err) => console.log("database cant be connected , Error: ", err));
