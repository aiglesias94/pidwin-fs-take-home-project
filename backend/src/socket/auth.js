import jwt from "jsonwebtoken";

const socketAuth = (socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    const token = socket.handshake.query.token;
    const isCustomAuth = token.length < 500;

    let decodedData;
    try {
      if (token && isCustomAuth) {
        decodedData = jwt.verify(token, "test");
        socket.userId = decodedData?._id;
      } else {
        decodedData = jwt.decode(token);
        socket.userId = decodedData?.sub;
      }
      console.log(`User ${socket.userId} authenticated`);
      socket.join(socket.userId);
      console.log(`User ${socket.userId} subscribed to notifications`);
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  } else {
    next(new Error("Authentication error"));
  }
};

export default socketAuth;
