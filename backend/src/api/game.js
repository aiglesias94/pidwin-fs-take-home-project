import express from "express";
import bet from "./game-bet.js";
import streaks from "./game-streaks.js";
import auth from "../utils/auth.js";

const router = express.Router();

router.post("/bet", auth, bet);
router.get("/topStreaks", auth, streaks);

export default router;
