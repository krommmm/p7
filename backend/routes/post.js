//Création d'un routeur pour les controllers
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const postsCtrl = require("../controllers/posts");

router.get("/", auth, postsCtrl.getAllPost);
router.post("/", auth, multer, postsCtrl.createPost);
router.get("/:id", auth, postsCtrl.getOnePost);
router.put("/:id", auth, multer, postsCtrl.modifyPost);
router.patch("/:id", auth, postsCtrl.HandleComments);
router.delete("/:id", auth, postsCtrl.deletePost);
router.post("/:id", auth, postsCtrl.likeOrDislike);

module.exports = router;
