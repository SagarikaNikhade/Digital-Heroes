const express = require("express");
const { createOrder, verifyPayment } = require("../controllers/payment.controller");
const { authMiddleware } = require("../middleware/auth.middleware")

const PaymentRouter = express.Router();

PaymentRouter.post("/create-order", authMiddleware, createOrder);
PaymentRouter.post("/verify", authMiddleware, verifyPayment);

module.exports = { PaymentRouter }