import * as mongoose from "mongoose";

declare interface IPromo extends mongoose.Document {
  name: string;
  description: string;
  image: string;
  label?: string | "New" | "Old" | "" | "Hot";
  price: number; //?chang the type to Currency
  featured: boolean;
}
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
let Promo: mongoose.Model<IPromo> = mongoose.model("Promo", promoSchema);

export default Promo;
