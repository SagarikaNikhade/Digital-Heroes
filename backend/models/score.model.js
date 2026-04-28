import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  score: {
    type: Number,
    min: 1,
    max: 45,
  },
  date: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Score", scoreSchema);