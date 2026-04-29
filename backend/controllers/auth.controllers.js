import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed
  });

  res.json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user){
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch){
    return res.status(400).json({ message: "Wrong password" });
  }

  const token = jwt.sign({ id: user._id }, "secret");

  res.json({ user: user, token:token });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

export const getAll = async (req, res) => {
  const user = await User.find();
  res.json(user);
};

export const activateSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan } = req.body;

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
      },
    });

    res.json({ message: "Subscription activated" });
  } catch (err) {
    res.status(500).json({ message: "Error activating subscription" });
  }
};