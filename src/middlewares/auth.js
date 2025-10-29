function checkAuth(req, res, next) {
  console.log("checking auth");

  const token = "shobhit";
  const isAuth = token === "shobhit";

  if (isAuth) {
    console.log("auth successfull");
    next();
  } else res.status(401).send("aut not provided");
}

module.exports = {
  checkAuth,
};
