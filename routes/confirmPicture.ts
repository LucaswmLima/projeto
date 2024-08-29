import express from "express";
const router = express.Router();

const ConfirmController = require("../controllers/confirmController");

router.patch("/", ConfirmController.confirm);

export default router;
