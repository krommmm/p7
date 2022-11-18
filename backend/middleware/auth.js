//Importation dotenv pour le fichier .env
require("dotenv").config();
const jwt = require("jsonwebtoken");
//console.log(jwt);
const tokenSecret = {
  jwtSecret: process.env.JWT_SECRET,
};

//Création middleware d'authentification, pour permettre aux requetes authentifiées de réussir
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, `${tokenSecret.jwtSecret}`);
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
    const name = decodedToken.name;
    const firstName = decodedToken.firstName;
    req.auth = {
      userId: userId,
      isAdmin: isAdmin,
      name: name,
      firstName: firstName,
    };

    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
