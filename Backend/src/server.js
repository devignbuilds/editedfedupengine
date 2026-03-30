import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import chatHandler from "./socket/chatHandler.js";

const PORT = parseInt(process.env.PORT, 10) || 5000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    // Allow local dev frontends (including network hosts) when FRONTEND_URL is not set
    // In production set FRONTEND_URL to the official frontend origin
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL : true,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  chatHandler(io, socket);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Touch: ensure nodemon picks up env changes when we edit .env
const maxPortRetries = 10;

const tryListen = (port, attemptsLeft = maxPortRetries) => {
  const server = httpServer.listen(port, () => {
    console.log(`Engine v1 Backend running on port ${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      if (attemptsLeft > 0) {
        console.warn(`Port ${port} is in use, trying port ${port + 1}...`);
        server.close();
        tryListen(port + 1, attemptsLeft - 1);
      } else {
        console.error(
          `Port ${port} is already in use and no retries left. Kill the process using it or set PORT env var and restart the server.`,
        );
        process.exit(1);
      }
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
};

tryListen(PORT);
