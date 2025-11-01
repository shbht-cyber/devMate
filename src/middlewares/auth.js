const User = require("../models/user");
const jwt = require("jsonwebtoken");

async function userAuth(req, res, next) {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid token");

    const decodedToken = await jwt.verify(token, "DEVMATEShobhit@911830");
    const { _id } = decodedToken;

    const user = await User.findById(_id);
    if (!user) throw new Error("User does not exist");

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
}

module.exports = {
  userAuth,
};
