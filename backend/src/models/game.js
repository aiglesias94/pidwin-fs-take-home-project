import mongoose from "mongoose";

const gameSchema = mongoose.Schema({
  dice1: { type: Number, min: 1, max: 6 },
  dice2: { type: Number, min: 1, max: 6 },
  lucky7: { type: Boolean },
  resultDate: { type: Date },
  id: { type: String },
});

export default mongoose.model("Game", gameSchema);
