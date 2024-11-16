const { Server } = require("socket.io");

let io;

const initSocketIO = (server) => {
  io = new Server(server);

  io.on("connection", (socket) => {
    console.log("A user connected!");

    socket.on("disconnect", () => {
      console.log("A user disconnected!");
    });
  });
};

const getSocketIOInstance = () => {
  if (!io) {
    throw new Error("Socket IO has not been init!!!");
  }
  return io;
};

module.exports = {
  initSocketIO,
  getSocketIOInstance,
};
