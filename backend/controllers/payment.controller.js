import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import User from "../models/user.model.js";

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;

    const amount = plan === "yearly" ? 5 : 1; // in INR paise
    // ₹50 = 5000 paise (adjust as you want)

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error creating order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // ✅ Activate subscription
    const duration = plan === "yearly" ? 365 : 30;

    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + duration * 24 * 60 * 60 * 1000
    );

    await User.findByIdAndUpdate(userId, {
      subscription: {
        plan,
        status: "active",
        startDate,
        endDate,
        paymentId: razorpay_payment_id,
      },
    });

    res.json({ message: "Payment verified & subscription activated" });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};