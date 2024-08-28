import express from "express";
const router = express.Router();

const PictureController = require("../controllers/pictureController");

router.post("/", PictureController.create);

export default router;
