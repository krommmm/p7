//Importation dotenv pour le fichier .env
require("dotenv").config();

//Importations
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const postsRoutes = require("./routes/post");
const path = require("path");
const bodyParser = require("body-parser");

const db = {
  user: process.env.MDB_USER,
  password: process.env.MDB_PASSWORD,
};

//Connexion à la base de données avec mongoose
mongoose
  .connect(
    `mongodb+srv://${db.user}:${db.password}@cluster0.76uerb1.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//express. json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.json());

//header pour gérer les erreurs de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

//Gestionnaires de routage
app.use("/api/auth", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

//Exportation
module.exports = app;
