const express = require("express");
const { getCharities,  selectCharity, createCharity} = require("../controllers/charity.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const CharityRouter = express.Router();

CharityRouter.get("/", getCharities);
CharityRouter.post("/select", authMiddleware, selectCharity);
CharityRouter.post("/create", authMiddleware, createCharity);

module.exports = { CharityRouter }