const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dishes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dish",
        },
      ],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
let Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
