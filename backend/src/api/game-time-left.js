import Game from "../models/game.js";
import { getRemainingTimeForNextGameMs } from "../services/rollerService.js";

const remainingTime = async (req, res) => {
  try {
    if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }

    return res
      .status(200)
      .json({ remainingTimeMs: getRemainingTimeForNextGameMs() });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default remainingTime;
