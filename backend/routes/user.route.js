const express = require("express");
const { signup, login, getMe, getAll, activateSubscription } = require("../controllers/auth.controllers");
const { authMiddleware } = require("../middleware/auth.middleware")

const UserRouter = express.Router();

UserRouter.post("/signup", signup);
UserRouter.post("/login", login);
UserRouter.get("/me", authMiddleware, getMe);
UserRouter.get("/", getAll);
UserRouter.post("/activate", authMiddleware, activateSubscription);

module.exports = { UserRouter }