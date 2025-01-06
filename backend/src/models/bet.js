import mongoose from "mongoose";
import betStatus from "./betStatus.js";

const betSchema = mongoose.Schema({
  toLucky7: { type: Boolean, required: true },
  status: {
    type: String,
    enum: Object.values(betStatus),
    required: true,
    default: betStatus.pending,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  amount: { type: Number, required: true },
  resultDate: { type: Date },
  created: { type: Date, default: Date.now() },
  id: { type: String },
});

export default mongoose.model("Bet", betSchema);
