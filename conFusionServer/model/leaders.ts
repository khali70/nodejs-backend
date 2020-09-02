import * as mongoose from "mongoose";

declare interface ILeader extends mongoose.Document {
  name: string;
  description: string;
  image: string;
  designation: string;
  abbr: string;
  featured: boolean;
}
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
let Leaders: mongoose.Model<ILeader> = mongoose.model("Leader", leaderSchema);

export default Leaders;
