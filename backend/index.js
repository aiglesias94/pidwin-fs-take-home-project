import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import userRouter from "./src/api/user.js";
import gameRouter from "./src/api/game.js";
import { rollDices, INTERVAL_MS } from "./src/services/rollerService.js";
import runTaskEveryInterval from "./src/utils/intervalTask.js";
import socketAuth from "./src/socket/auth.js";
import setupSocket from "./src/socket/setupSocket.js";
dotenv.config();
const app = express();
const server = http.createServer(app);
export const io = new Server(server);

app.use(bodyParser.json({ limit: "5mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/game", gameRouter);

const PORT = process.env.PORT || 5000;

runTaskEveryInterval(rollDices, INTERVAL_MS).then((r) => {
  console.error("game interrupted");
  process.exit(1);
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    server.listen(PORT, () => console.log(`Server Started On Port ${PORT}`));
    io.use(socketAuth).on("connection", setupSocket);
  })
  .catch((error) => console.log(error.message));
