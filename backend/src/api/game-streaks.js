import { getTop10Streaks } from "../services/betService.js";

const streaks = async (req, res) => {
  try {
    if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }
    const topStreaks = await getTop10Streaks();

    const result = topStreaks.map((s) => {
      return { email: s.email, streak: s.streak };
    });

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default streaks;
