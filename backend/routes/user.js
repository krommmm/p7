const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", userCtrl.readUsers);
router.get("/:id", userCtrl.readOneUser);
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.put("/:id", auth, multer, userCtrl.modifyUser);
router.patch("/:id", auth, multer, userCtrl.deleteImageProfil);

module.exports = router;
