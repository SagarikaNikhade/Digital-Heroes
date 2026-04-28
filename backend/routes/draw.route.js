const express = require("express");
const { runDraw, getLatestDraw } = require("../controllers/draw.controller");

const DrawRouter = express.Router();

DrawRouter.post("/run", runDraw);
DrawRouter.get("/latest", getLatestDraw);

module.exports = { DrawRouter }