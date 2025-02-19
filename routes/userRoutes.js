const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const userController = require("../controllers/userController");

router.post("/create-organization", upload.none(), userController.createOrganization);

router.post("/share-:type-to-organization", upload.none(), userController.shareToOrganization);

router.post("/share-:type", upload.none(), userController.share);

router.post("/update", upload.none(), userController.update);

router.post("/create-:type", upload.none(), userController.create);

router.get("/user-access", userController.userAccess);

router.post("/delete-:type", upload.none(), userController.deleteEntity);

router.get("/search-users", userController.searchUsers)

router.get("/profile", userController.profile);

router.post("/upload-avatar", upload.single('avatar'), userController.uploadAvatar);
module.exports = router;
