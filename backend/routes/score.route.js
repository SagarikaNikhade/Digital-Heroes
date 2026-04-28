const express = require("express");
const { addScore, getScores } = require("../controllers/score.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const scoreRouter = express.Router();

scoreRouter.post("/add", authMiddleware, addScore);
scoreRouter.get("/", authMiddleware, getScores);

module.exports = { scoreRouter }