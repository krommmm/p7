//Création d'un modèle de sauce pour la bdd

const mongoose = require("mongoose");
var mongodbErrorHandler = require("mongoose-mongodb-errors");

mongoose.plugin(mongodbErrorHandler);

const postsSchema = new mongoose.Schema({
  posterId: { type: String, required: true },
  posterMessage: { type: String, required: true },
  imageUrl: { type: String, required: false },
  com: { type: String, required: false },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
  date: { type: String },
  comments: {
    type: [
      {
        commenterId: String,
        commenterName: String,
        commenterFirstName: String,
        text: String,
        date: String,
        crud: String,
        commentaireId: String,
      },
    ],
    required: false,
  },
});

postsSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("Post", postsSchema);
