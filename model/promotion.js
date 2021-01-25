const mongoose = require("mongoose");

/* declare interface IPromo extends mongoose.Document {
  name: string;
  description: string;
  image: string;
  label?: string | "New" | "Old" | "" | "Hot";
  price: number; //? number.toLocaleString('ar-EG',{style:'currency',currency:'EGP'})
  featured: boolean;
} */
const promoSchema = new mongoose.Schema(
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
let Promo = mongoose.model("Promo", promoSchema);
module.exports = Promo;
