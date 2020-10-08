const mongoose = require("mongoose");

/* declare interface ILeader extends mongoose.Document {
  name: string;
  description: string;
  image: string;
  designation: string;
  abbr: string;
  featured: boolean;
} */
const leaderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      require: true,
    },
    abbr: {
      type: String,
      require: true,
    },
    designation: {
      type: String,
      require: true,
    },
    featured: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
let Leaders = mongoose.model("Leader", leaderSchema);
// : mongoose.Model<ILeader>
module.exports = Leaders;
