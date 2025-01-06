import { createBet } from "../services/betService.js";
import { getRemainingTimeForNextGameMs } from "../services/rollerService.js";
import User from "../models/user.js";

const bet = async (req, res) => {
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  const { amount, toLucky7 } = req.body;
  try {
    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    if (typeof toLucky7 !== "boolean") {
      return res
        .status(400)
        .json({ message: "Invalid toLucky7 should be boolean" });
    }

    const result = await createBet(amount, toLucky7, req.userId);

    if (!result) {
      return res.status(400).json({
        message: "Insufficient time left",
        timeLeft: getRemainingTimeForNextGameMs(),
      });
    }
    const user = await User.findById(result.user);
    return res.status(200).json({
      user: user.email,
      amount: result.amount,
      toLucky7: result.toLucky7,
      created: result.created,
      timeLeft: getRemainingTimeForNextGameMs(),
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default bet;
