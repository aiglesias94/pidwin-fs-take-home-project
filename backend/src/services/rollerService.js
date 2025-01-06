import Game from "../models/game.js";
import { updateBetsResult } from "./betService.js";

const INTERVAL_MS = 15000;

let lastResultDate = null;
let nextGameId = null;

function getRandomDiceNumber() {
  return Math.floor(Math.random() * 6) + 1;
}

const rollDices = async () => {
  if (nextGameId != null) {
    const dice1 = getRandomDiceNumber();
    const dice2 = getRandomDiceNumber();
    lastResultDate = new Date();

    console.log(`Dices Result: ${dice1}, ${dice2}, updating game`);
    await updateGameResult(dice1, dice2, lastResultDate);

    const lucky7 = dice1 + dice2 === 7;
    if (lucky7) console.log("Lucky 7");
    await updateBetsResult(nextGameId, lucky7, new Date());
  }

  await createPendingNextGame();
  console.log("Waiting for next game");
};

const getNextGameStartTime = () => {
  return !lastResultDate
    ? null
    : new Date(lastResultDate.getTime() + INTERVAL_MS);
};

const getRemainingTimeForNextGameMs = () => {
  if (!lastResultDate) return 0;
  const remainingTime = getNextGameStartTime() - new Date();
  return remainingTime > 0 ? remainingTime : 0;
};

const updateGameResult = async (dice1, dice2, resultDate) => {
  try {
    const lucky7 = dice1 + dice2 === 7;
    await Game.findByIdAndUpdate(nextGameId, {
      dice1,
      dice2,
      lucky7,
      resultDate,
    });
  } catch (error) {
    console.error("Error updating game:", error);
    throw error;
  }
};

const createPendingNextGame = async () => {
  try {
    const nextGame = await Game.create({});
    nextGameId = nextGame._id.toString();
  } catch (error) {
    console.error("Error creating next game:", error);
    throw error;
  }
};

const getNextGameId = () => {
  return nextGameId;
};

export { INTERVAL_MS, rollDices, getRemainingTimeForNextGameMs, getNextGameId };
