const express = require("express");
const { dirname } = require("path");
const { Socket } = require("socket.io");
const app = express();
//socket server
const Server = require("http").createServer(app);
const io = require("socket.io")(Server);

app.use(express.json());

app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

//socket connection
io.on("connection", (client) => {
  console.log("user connected");

  //msg from server
  client.on("client message", (msg) => {
    io.emit("client message", { msg: "Welcome to the chat application!!!" });
  });

  //msg from client
  client.on("chat message", (message) => {
    console.log(" message:", message);
  });

  client.on("disconnect", () => {
    console.log("user disocnnected");
  });
});

const PORT = 3001;
Server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT} `);
});
