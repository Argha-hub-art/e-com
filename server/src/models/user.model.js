const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
