import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  streak: { type: Number, required: true, default: 0 },
  id: { type: String },
});

export default mongoose.model("User", userSchema);
