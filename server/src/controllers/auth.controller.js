const User = require("../models/user.model");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Invalid Request: All fields are required.",
        error: true,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Invalid Request: Password must be at least 6 characters.",
        error: true,
      });
    }

    try {
      const existingUsers = await User.find({
        username: username,
      }).exec();

      if (existingUsers.length > 0) {
        return res.json({
          message: "User already exists.",
          error: true,
        });
      }

      const passwordHash = await argon2.hash(password);

      await User.create({
        username: username,
        passwordHash: passwordHash,
      });
      return res.json({ message: "Registered successfully", error: false });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        message:
          "Something went wrong while processing your request. This is a server error contact administrator with this message.",
        error: true,
      });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Invalid Request: LoginId or password is incorrect.",
        error: true,
      });
    }

    try {
      const existingUsers = await User.find({ username: username }).exec();

      const user = existingUsers[0];

      // Password check
      const verifyPassword = await argon2.verify(
        user?.passwordHash || "",
        password
      );

      if (verifyPassword) {
        const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET);

        res.cookie("auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
        });

        return res.json({
          user: { username: user.username, isAdmin: user.isAdmin },
          message: "Logged in successfully",
          error: false,
        });
      } else {
        return res.status(404).json({
          message: "Invalid Request: LoginId or password is incorrect",
          error: true,
        });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        message:
          "Something went wrong while processing your request. This is a server error contact administrator with this message.",
        error: true,
      });
    }
  },
};
