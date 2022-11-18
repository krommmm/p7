//Importation dotenv pour le fichier .env
require("dotenv").config();
const fs = require("fs");

const tokenSecret = {
  jwtSecret: process.env.JWT_SECRET,
};

const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

//--------------------------Logiques métiers pour les utilisateurs--------------------------

//--------------------------Création de nouveaux utilisateurs--------------------------
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
        name: req.body.name,
        firstName: req.body.firstName,
        isAdmin: "false",
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//--------------------------Création d'une connexion des différents utilisateurs--------------------------
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          res.status(200).json({
            userId: user._id,
            isAdmin: user.isAdmin,
            name: user.name,
            firstName: user.firstName,
            //Rajout dans le token de l'id du user et s'il est admin ou non
            token: jwt.sign(
              {
                userId: user._id,
                isAdmin: user.isAdmin,
                firstName: user.firstName,
                name: user.name,
              },
              `${tokenSecret.jwtSecret}`,
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//--------------------------Lecture des users--------------------------
exports.readUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//--------------------------Lecture d'un seul utilisateur--------------------------
exports.readOneUser = (req, res, next) => {
  User.findOne({
    _id: req.params.id,
  })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

//--------------------------Modification d'un utilisateur--------------------------
exports.modifyUser = (req, res, next) => {
  const userObject = req.file
    ? {
        ...req.body,
        imageProfil: req.file.filename,
      }
    : { ...req.body };

  User.findOne({ _id: req.params.id }).then((user) => {
    if (
      req.file.filename !== user.imageProfil &&
      user.imageProfil !== "ImageProfileDefault.jpg"
    ) {
      fs.unlink(`images/${user.imageProfil}`, () => {
        User.updateOne(
          { _id: req.params.id },
          { ...userObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié" }))
          .catch((error) => res.status(400).json({ error }));
      });
    } else {
      User.updateOne(
        { _id: req.params.id },
        { ...userObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Objet modifié" }))
        .catch((error) => res.status(400).json({ error }));
    }
  });
};

//--------------------------Suppression de l'image de Profil--------------------------
exports.deleteImageProfil = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (user.imageProfil !== "ImageProfileDefault.jpg") {
        fs.unlink(`images/${user.imageProfil}`, () => {});
      }
      user.imageProfil = "ImageProfileDefault.jpg";
      user.save();
    })
    .then(() => res.status(200).json({ message: "Objet modifié" }))
    .catch((error) => res.status(400).json({ error }));
};
