const express = require("express");
const { runDraw, getLatestDraw } = require("../controllers/draw.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware")

const DrawRouter = express.Router();

DrawRouter.post("/run", authMiddleware,  runDraw);
DrawRouter.get("/latest", getLatestDraw);

module.exports = { DrawRouter }