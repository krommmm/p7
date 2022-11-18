//Création d'un modèle d'utilisateur pour la bdd

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
var mongodbErrorHandler = require("mongoose-mongodb-errors");

mongoose.plugin(mongodbErrorHandler);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  firstName: { type: String, required: true },
  isAdmin: { type: Boolean, default: "false" },
  imageProfil: {
    type: String,
    default: "ImageProfileDefault.jpg",
    required: false,
  },
});

userSchema.plugin(mongodbErrorHandler);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
