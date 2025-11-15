const express = require("express");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/database");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/requests");
const { userRouter } = require("./routes/user");

const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.1.4:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("database connected successfully!!");
    app.listen(process.env.PORT, "0.0.0.0", () =>
      console.log(`server started at port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log("database cant be connected , Error: ", err));
