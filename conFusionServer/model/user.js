const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
Schema = mongoose.Schema;
const User = new Schema({
  admin: {
    type: Boolean,
    default: false,
  },
});
User.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", User);
//number.toLocaleString('ar-EG',{style:'currency',currency:'EGP'})
