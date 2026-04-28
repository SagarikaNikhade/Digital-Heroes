import Score from "../models/score.model.js";
import User from "../models/user.model.js";

export const addScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { score, date } = req.body;

    const user = await User.findById(userId);

    if (user.subscription?.status !== "active") {
      return res.status(403).json({ message: "Please subscribe first" });
    }

     // ❌ duplicate date check
    const exists = await Score.findOne({ userId, date });
    if (exists) {
      return res.status(400).json({ message: "Score already exists for this date" });
    }

    // 📊 get existing scores
    const scores = await Score.find({ userId }).sort({ date: 1 });

    // 🧹 keep only 5
    if (scores.length >= 5) {
      await Score.deleteOne({ _id: scores[0]._id });
    }

    const newScore = await Score.create({ userId, score, date });

    res.json(newScore);
  } catch (err) {
    res.status(500).json({ message: "Error adding score" });
  }
};

export const getScores = async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user.id })
      .sort({ date: -1 });

    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: "Error fetching scores" });
  }
};