const mongoose = require("mongoose");
/* LIST:17
 *promos
 *leaders
 */
/* interface Icomment extends mongoose.Document {
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  author: string;
  _id: any;
}
declare interface IDishes extends mongoose.Document {
  name: string;
  description: string;
  image: string;
  category: string;
  label?: string | "New" | "Old" | "" | "Hot";
  price: number; //? number.toLocaleString('ar-EG',{style:'currency',currency:'EGP'})

  featured: boolean;
  comments?: Icomment[];
} */
const commentSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const dishSchema = new mongoose.Schema(
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
    comments: {
      type: [commentSchema],
      required: false,
    },
    image: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    label: {
      type: String,
      default: "",
      require: false,
    },
    price: {
      type: Number,
      min: 0,
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
let Dishes = mongoose.model("Dish", dishSchema);
module.exports = Dishes;
