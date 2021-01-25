const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    telnum: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contactType: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    agree: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
let Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
