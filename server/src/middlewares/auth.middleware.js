const jwt = require("jsonwebtoken");

module.exports = {
  verify: (req, res, next) => {
    const token = req.cookies["auth_token"];

    if (!token) {
      return res.status(400).json({
        error: true,
        message: "Invalid request: User doesn't exists",
      });
    }

    const payload = jwt.decode(token);

    if (payload && payload.id) {
      req.userId = payload.id;
      return next();
    } else {
      return res.status(400).json({
        error: true,
        message: "Invalid request: User doesn't exists",
      });
    }
  },
};
