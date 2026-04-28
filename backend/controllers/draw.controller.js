import Draw from "../models/draw.model.js";
import Score from "../models/score.model.js";

const generateNumbers = () => {
    const nums = new Set();

    while (nums.size < 5) {
        nums.add(Math.floor(Math.random() * 45) + 1);
    }

    return Array.from(nums);
};

const getMatchCount = (userScores, drawNumbers) => {
    return userScores.filter((num) => drawNumbers.includes(num)).length;
};

export const runDraw = async (req, res) => {
    try {
        const drawNumbers = generateNumbers();

        const users = await Score.distinct("userId");

        const results = [];

        for (let userId of users) {
            const userScores = await Score.find({ userId });
            const scoresArray = userScores.map((s) => s.score);

            const matchCount = getMatchCount(scoresArray, drawNumbers);

            if (matchCount >= 3) {
                results.push({
                    userId,
                    matchCount,
                });
            }
        }

        const draw = await Draw.create({
            numbers: drawNumbers,
            month: new Date().toISOString().slice(0, 7),
            winners: results,
        });

        res.json(draw);
    } catch (err) {
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