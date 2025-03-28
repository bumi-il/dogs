const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  profilePic: {
    type: mongoose.Types.ObjectId,
    ref: "favorites",
  },
});

module.exports = mongoose.model("users", UserSchema);
