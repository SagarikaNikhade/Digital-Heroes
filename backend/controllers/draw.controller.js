import Draw from "../models/draw.model.js";
import Score from "../models/score.model.js";
import User from "../models/user.model.js";

import {
  generateNumbers,
  getMatchCount,
  calculatePrizePool,
  splitTiers,
} from "../utils/draw.utils.js";

export const runDraw = async (req, res) => {
  try {
    // 1. Generate numbers
    const drawNumbers = generateNumbers();

    // 2. Active users
    const activeUsers = await User.countDocuments({
      "subscription.status": "active",
    });

    const prizePool = calculatePrizePool(activeUsers);
    let tiers = splitTiers(prizePool);

    // 3. Get all users with scores
    const users = await Score.distinct("userId");

    const winners5 = [];
    const winners4 = [];
    const winners3 = [];

    for (let userId of users) {
      const userScores = await Score.find({ userId });

      const scoresArray = userScores.map((s) => s.score);

      const matchCount = getMatchCount(scoresArray, drawNumbers);

      if (matchCount === 5) winners5.push(userId);
      else if (matchCount === 4) winners4.push(userId);
      else if (matchCount === 3) winners3.push(userId);
    }

    // 4. Jackpot carry forward
    const previousDraw = await Draw.findOne().sort({ createdAt: -1 });

    let carryForward = previousDraw?.jackpotCarryForward || 0;

    if (winners5.length === 0) {
      carryForward += tiers.match5;
      tiers.match5 = 0;
    } else {
      tiers.match5 += carryForward;
      carryForward = 0;
    }

    // 5. Prize distribution
    const winners = [];

    const distribute = (usersArr, tierAmount, matchCount) => {
      if (usersArr.length === 0) return;

      const prizeEach = tierAmount / usersArr.length;

      usersArr.forEach((userId) => {
        winners.push({
          userId,
          matchCount,
          prize: prizeEach,
        });
      });
    };

    distribute(winners5, tiers.match5, 5);
    distribute(winners4, tiers.match4, 4);
    distribute(winners3, tiers.match3, 3);

    // 6. Save draw
    const draw = await Draw.create({
      numbers: drawNumbers,
      month: new Date().toISOString().slice(0, 7),

      prizePool,
      tiers,
      winners,

      jackpotCarryForward: carryForward,
    });

    res.json(draw);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Draw failed" });
  }
};

export const getLatestDraw = async (req, res) => {
  try {
    const draw = await Draw.findOne().sort({ createdAt: -1 });

    if (!draw) {
      return res.status(404).json({ message: "No draw found" });
    }

    res.json(draw);
  } catch (err) {
    res.status(500).json({ message: "Error fetching draw" });
  }
};