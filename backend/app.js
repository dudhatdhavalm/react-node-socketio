const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const indexRoute = require("./routes/index");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(indexRoute);

const server = http.createServer(app);

const io = socketIO(server);

const getApiAndEmit = async socket => {
  try {
    socket.emit("FromAPI", parseInt(Math.random() * 100));
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

let interval;

io.on("connection", socket => {
  console.log("New Client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 10000);
  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
