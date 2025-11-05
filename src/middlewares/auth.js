const User = require("../models/user");
const jwt = require("jsonwebtoken");

async function userAuth(req, res, next) {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "please login!" });
    }

    const decodedToken = await jwt.verify(token, "DEVMATEShobhit@911830");
    const { _id } = decodedToken;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  userAuth,
};
