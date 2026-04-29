import mongoose from "mongoose";

const drawSchema = new mongoose.Schema({
  numbers: {
    type: [Number],
    required: true,
  },

  month: {
    type: String, // "2026-04"
    required: true,
  },

  prizePool: {
    type: Number,
    default: 0,
  },

  tiers: {
    match5: Number,
    match4: Number,
    match3: Number,
  },

  winners: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      matchCount: Number,
      prize: Number,
    },
  ],

  jackpotCarryForward: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Draw", drawSchema);