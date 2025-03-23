const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  imgSrc: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

module.exports = mongoose.model("favorites", FavoriteSchema);
