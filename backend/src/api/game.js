import express from "express";
import bet from "./game-bet.js";
import streaks from "./game-streaks.js";
import auth from "../utils/auth.js";
import gameList from "./game-list.js";
import betList from "./game-bet-list.js";
import remainingTime from "./game-time-left.js";

const router = express.Router();

router.post("/bet", auth, bet);
router.get("/topStreaks", auth, streaks);
router.get("/list", auth, gameList);
router.get("/bets", auth, betList);
router.get("/time", auth, remainingTime);

export default router;
