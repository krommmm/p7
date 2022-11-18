const Post = require("../models/posts");
const fs = require("fs");
require("dotenv").config();

const db = {
  port: process.env.PORT,
};

//--------------------------Logiques métiers pour les posts--------------------------

//--------------------------Creation d'un nouveau post--------------------------
exports.createPost = (req, res, next) => {
  if (req.file) {
    const postObject = req.body;
    const post = new Post({
      ...postObject,
      imageUrl: req.file.filename,
    });
    post
      .save()
      .then(() => {
        res.status(201).json({ _id: post._id });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } else {
    const postObject = req.body;
    const post = new Post({
      ...postObject,
    });
    post
      .save()
      .then(() => res.status(201).json({ message: "objet créé !" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

//--------------------------Recevoir les posts--------------------------
exports.getAllPost = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//--------------------------Recevoir un post--------------------------
exports.getOnePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

//--------------------------Modifier un post--------------------------
exports.modifyPost = (req, res, next) => {
  //Si il y a une image
  if (req.file) {
    const postObject = req.file
      ? {
          ...req.body,
          imageUrl: req.file.filename,
        }
      : { ...req.body };
    Post.findOne({ _id: req.params.id }).then((post) => {
      //si l'id du poster != à l'id dans authorization alors ce post n'appartient pas au l'utilisateur ET que l'utilisateur n'est pas un administrateur
      if (post.posterId != req.auth.userId && req.auth.isAdmin == false) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        //Si l'image envoyée est différente de l'image du post(bdd) alors suppression de l'image du post dans le dossier si non : update sans suppression
        if (req.body.image !== post.imageUrl) {
          const filename = post.imageUrl;
          fs.unlink(`images/${filename}`, () => {
            Post.updateOne(
              { _id: req.params.id },
              { ...postObject, _id: req.params.id }
            )
              .then(() => res.status(200).json({ message: "Objet modifié" }))
              .catch((error) => res.status(400).json({ error }));
          });
        } else {
          Post.updateOne(
            { _id: req.params.id },
            { ...postObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Objet modifié" }))
            .catch((error) => res.status(400).json({ error }));
        }
      }
    });
  } else {
    //Si il n'y a pas d'image
    Post.findOne({ _id: req.params.id }).then((post) => {
      //si l'id du poster != à l'id dans authorization alors ce post n'appartient pas au l'utilisateur ET que l'utilisateur n'est pas un administrateur
      if (post.posterId != req.auth.userId && req.auth.isAdmin == false) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Post.updateOne(
          { _id: req.params.id },
          { ...req.body, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié" }))
          .catch((error) => res.status(400).json({ error }));
      }
    });
  }
};

//--------------------------Supprimer un post--------------------------
exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }) //{id: id du Post} same auth
    .then((post) => {
      // si l'id du poster != à l'id dans authorization alors ce post n'appartient pas au l'utilisateur ET que l'utilisateur n'est pas un administrateur
      if (post.posterId != req.auth.userId && req.auth.isAdmin == false) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        //Si il y a un champ imageUrl dans le post alors on supprime l'image du dossier puis le post
        if (post.imageUrl != null) {
          const filename = post.imageUrl;
          fs.unlink(`images/${filename}`, () => {
            Post.deleteOne({ _id: req.params.id })
              .then(() => {
                res.status(200).json({ message: "Objet et image supprimés!" });
              })
              .catch((error) => res.status(401).json({ error }));
          });
        } else {
          //Sinon on supprime seulement le post
          Post.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        }
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//--------------------------COMMENTAIRES--------------------------

exports.HandleComments = (req, res, next) => {
  Post.findOne({ _id: req.params.id });

  const CRUD = req.body.crud;
  switch (CRUD) {
    //Create
    case "c":
      Post.updateOne(
        { _id: req.params.id },
        {
          $push: { comments: [req.body] },
        }
      )
        .then(() => res.status(200).json({ message: "Object created" }))
        .catch((error) => res.status(400).json({ error }));
      break;

    case "u":
      //Update
      Post.findOne({ _id: req.params.id }).then((post) => {
        // Pour chaque commentaires du post sélectionné
        for (var a = 0; a < post.comments.length; a++) {
          //Si le com du post(bdd) a la même id que la request.body alors il s'agit bien du bon commentaire
          if (post.comments[a]._id == req.body.commentaireId) {
            //Si ce commentaire(bdd) a la même posterId que l'utilisateur (request.body) alors c'est le com' de l'utilisateur
            if (
              req.body.commenterId == post.comments[a].commenterId ||
              req.auth.isAdmin == true
            ) {
              //Alors le text du com' selectionné prend la valeur du text de la request.body + pareil pour la date
              post.comments[a].text = req.body.text;
              post.comments[a].date = req.body.date
              
              post
                .save()
                .then(() => res.status(200).json({ message: "Object updated" }))
                .catch((error) => res.status(400).json({ error }));
            } else {
              res.status(401).json({ message: "Not authorized" });
            }
          }
        }
      });
      break;

    case "d":
      //Delete
      Post.findOne({ _id: req.params.id }).then((post) => {
        //Pour chaque com' du post selectionné
        for (var a = 0; a < post.comments.length; a++) {
          //Si le com du post(bdd) a la même id que la request.body alors il s'agit bien du bon commentaire
          if (post.comments[a]._id == req.body.commentaireId) {
            //Si ce commentaire(bdd) a la même posterId que l'utilisateur (request.body) alors c'est le com' de l'utilisateur
            if (
              req.body.commenterId == post.comments[a].commenterId ||
              req.auth.isAdmin == true
            ) {
              //j'enlève le commentaire qui correspondent à la condition de l'_id du com'.
              post.comments.remove(post.comments[a]._id);
              post
                .save()
                .then(() => res.status(200).json({ message: "Object deleted" }))
                .catch((error) => res.status(400).json({ error }));
            } else {
              res.status(401).json({ message: "Not authorized" });
            }
          }
        }
      });
      break;
  }
};

//--------------------------LIKES--------------------------

exports.likeOrDislike = (req, res, next) => {
  //Si un utilisateur like
  if (req.body.like === 1) {
    Post.findOne({ _id: req.params.id }).then((post) => {
      //Si userId dans tab-like
      if (post.usersLiked.includes(req.body.userId)) {
        Post.updateOne(
          { _id: req.params.id },
          {
            $pull: { usersLiked: req.body.userId },
            $inc: { likes: req.body.like++ * -1 },
          }
        )
          .then(() => res.status(200).json({ message: "like retiré" }))
          .catch((error) => res.status(400).json({ error }));

        //Si pas userId dans tab-like
      } else if (post.usersLiked.includes(req.body.userId) === false) {
        // et si userId dans tab-dislike
        if (post.usersDisliked.includes(req.body.userId)) {
          Post.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { likes: req.body.like++, dislikes: -1 },
              $push: { usersLiked: req.body.userId },
            }
          )
            .then(() => res.status(200).json({ message: "dislike supprimé" }))
            .catch((error) => res.status(400).json({ error }));
        } // ou si pas userId dans tab-dislike
        else if (post.usersDisliked.includes(req.body.userId) === false) {
          Post.updateOne(
            { _id: req.params.id },
            {
              $push: { usersLiked: req.body.userId },
              $inc: { likes: req.body.like++ },
            }
          )
            .then(() => res.status(200).json({ message: "like ajouté" }))
            .catch((error) => res.status(400).json({ error }));
        }
      }
      //Rajouter même condition pour includes usersDislike et enlever
    });

    //-----------like = -1-----------------
  } else if (req.body.like === -1) {
    Post.findOne({ _id: req.params.id }).then((post) => {
      //Si cet utilisateur est retrouvé dans le tableau dislike :   on enlève l'id du tableau et on décrémente le dislike
      if (post.usersDisliked.includes(req.body.userId)) {
        Post.updateOne(
          { _id: req.params.id },
          {
            $pull: { usersDisliked: req.body.userId },
            $inc: { dislikes: req.body.like++ },
          }
        )
          .then(() => res.status(200).json({ message: "dislike retiré" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (post.usersDisliked.includes(req.body.userId) === false) {
        if (post.usersLiked.includes(req.body.userId)) {
          Post.updateOne(
            { _id: req.params.id },
            {
              $push: { usersDisliked: req.body.userId },
              $pull: { usersLiked: req.body.userId },
              $inc: { likes: -1, dislikes: req.body.like++ * -1 },
            }
          )
            .then(() => res.status(200).json({ message: "dislike supprimé" }))
            .catch((error) => res.status(400).json({ error }));
        } // ou si pas userId dans tab-dislike
        else if (post.usersLiked.includes(req.body.userId) === false) {
          Post.updateOne(
            { _id: req.params.id },
            {
              $push: { usersDisliked: req.body.userId },
              $inc: { dislikes: req.body.like++ * -1 },
            }
          )
            .then(() => res.status(200).json({ message: "dislike ajouté" }))
            .catch((error) => res.status(400).json({ error }));
        }
      }
    });
    // Si malgré tout un utilisateur envoie un 0 avec postman
  } else {
    console.log("Pas le bon chiffre");
  }
};
