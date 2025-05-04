const http = require("http");
const express = require("express");
const path = require("path");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  let username = '';

  socket.on("join", (name) => {
    username = name;
    console.log(`✅ ${username} connected`);
    socket.broadcast.emit("system", `🔔 ${username} has joined the chat`);
  });

  socket.on("chat message", ({ user, text }) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    io.emit("chat message", { user, text, time });
  });

  socket.on("disconnect", () => {
    if (username) {
      console.log(`❌ ${username} disconnected`);
      socket.broadcast.emit("system", `❌ ${username} has left the chat`);
    }
  });
});

server.listen(9000, () => {
  console.log("🚀 Server started on http://localhost:9000");
});
