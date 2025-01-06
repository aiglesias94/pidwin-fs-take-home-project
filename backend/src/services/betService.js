import {
  getNextGameId,
  getRemainingTimeForNextGameMs,
} from "./rollerService.js";
import Bet from "../models/bet.js";
import betStatus from "../models/betStatus.js";
import User from "../models/user.js";
import { io } from "../../index.js";

const VALID_TIME_FRAME_MS = 5000;

const validBet = () => {
  return getRemainingTimeForNextGameMs() > VALID_TIME_FRAME_MS;
};

const createBet = async (amount, toLucky7, userId) => {
  if (!validBet()) {
    console.log("Insufficient time left");
    return null;
  }

  try {
    const bet = await Bet.create({
      status: betStatus.pending,
      amount,
      toLucky7,
      streak: 0,
      user: userId,
      game: getNextGameId(),
      created: new Date(),
    });

    return bet;
  } catch (error) {
    console.error("Error creating bet:", error);
    throw error;
  }
};

const getTop10Streaks = async () => {
  try {
    const topRecords = await User.find()
      .sort({ streak: -1 })
      .limit(10)
      .select("email streak");
    return topRecords;
  } catch (error) {
    console.error("Error retrieving top ten records:", error);
  }
};

const updateBetsResult = async (game, lucky7, resultDate) => {
  console.log("Updating bets");

  try {
    await Bet.updateMany(
      { game, toLucky7: lucky7 },
      {
        $set: {
          status: betStatus.won,
          resultDate: resultDate,
        },
      },
    );

    const winnerUsers = await Bet.find({ game, toLucky7: lucky7 }, "user");
    const winnerIds = winnerUsers.map((u) => u.user.toString());

    await User.updateMany({ _id: { $in: winnerIds } }, { $inc: { streak: 1 } });
    notifyUsers(winnerIds, true);
    console.log(`Winners updated`);

    await Bet.updateMany(
      { game, toLucky7: !lucky7 },
      {
        $set: {
          status: betStatus.lost,
          resultDate: resultDate,
        },
      },
    );

    const noWinnerUsers = await Bet.find({ game, toLucky7: !lucky7 }, "user");
    const noWinnersIds = noWinnerUsers.map((u) => u.user.toString());

    await User.updateMany(
      { _id: { $in: noWinnersIds } },
      { $set: { streak: 0 } },
    );
    notifyUsers(noWinnersIds, false);
    console.log(`Losers updated`);
  } catch (error) {
    console.error("Error updating bets:", error);
    throw error;
  }
};

const notifyUsers = (userIds, isWin) => {
  for (let i = 0; i < userIds.length; i++) {
    const userSubscribed = io.sockets.adapter.rooms.get(userIds[i]);
    if (userSubscribed) {
      io.to(userIds[i]).emit("betOutcome", { isWin });
    } else {
      console.log(`User ${userIds[i]} is not connected`);
    }
  }
};

export { updateBetsResult, createBet, getTop10Streaks };
