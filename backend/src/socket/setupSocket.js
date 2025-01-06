import jwt from "jsonwebtoken";

const setupSocket = (socket) => {
  console.log("User connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
};

export default setupSocket;
