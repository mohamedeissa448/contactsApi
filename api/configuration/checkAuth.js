const users = require("./config");

module.exports = (req, res, next) => {
  //check authorization
  let isAuthorized = false,
    userId = "";
  users.forEach(user => {
    if (
      req.body.authorization === user.authorization &&
      req.body.deviceToken === user.deviceToken &&
      req.body.fingerPrint === user.fingerPrint
    ) {
      isAuthorized = true;
      userId = user.userId;
    }
  });
  if (!isAuthorized) {
    res.status(403).json({
      message: " 403 forbidden, Not allowed operation"
    });
  } else {
    req.body.userId = userId;
    next();
  }
};
