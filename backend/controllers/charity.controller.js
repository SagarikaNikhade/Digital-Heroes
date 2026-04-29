import Charity from "../models/charity.model.js";
import User from "../models/user.model.js";

// Get all charities
export const getCharities = async (req, res) => {
  const data = await Charity.find();
  res.json(data);
};

// Select charity
export const selectCharity = async (req, res) => {
  const { charityId, percent } = req.body;

  await User.findByIdAndUpdate(req.user.id, {
    charity: charityId,
    charityPercent: percent,
  });

  res.json({ message: "Charity selected" });
};

export const createCharity = async (req, res) => {
  try {
    const charity = await Charity.create(req.body);
    res.json(charity);
  } catch (err) {
    res.status(500).json({ message: "Error creating charity" });
  }
};