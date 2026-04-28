import mongoose from "mongoose";

const drawSchema = new mongoose.Schema({
  numbers: [Number], // 5 numbers
  month: String,     // "2026-04"
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Draw", drawSchema);