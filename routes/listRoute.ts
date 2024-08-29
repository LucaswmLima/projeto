import express from "express";
const router = express.Router();

const listController = require("../controllers/addController");

router.get("/", listController.list);

export default router;
