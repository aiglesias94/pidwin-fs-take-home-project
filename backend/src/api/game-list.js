import Game from "../models/game.js";

const gameList = async (req, res) => {
  try {
    if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }
    const { page = 1, limit = 10 } = req.query;

    const gameList = await Game.find()
      .sort({ resultDate: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const result = gameList.map((g) => {
      return {
        dice1: g.dice1,
        dice2: g.dice2,
        lucky7: g.lucky7,
        resultDate: g.resultDate,
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default gameList;
