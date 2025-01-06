import { getTop10Streaks } from "../services/betService.js";
import Game from "../models/game.js";
import Bet from "../models/bet.js";

const betList = async (req, res) => {
  try {
    if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }
    const { page = 1, limit = 10 } = req.query;

    const betList = await Bet.find({ user: req.userId })
      .sort({ created: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("user")
      .exec();

    const result = betList.map((b) => {
      return {
        amount: b.amount,
        toLucky7: b.toLucky7,
        status: b.status,
        created: b.created,
        user: b.user.email,
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default betList;
