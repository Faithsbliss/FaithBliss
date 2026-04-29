import http from "http";
import { Server } from "socket.io";
import app, { connectDB } from "./app";
import { initializeSocketIO } from "./socket/socket";
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
].filter((origin): origin is string => Boolean(origin));

// Create HTTP server
const httpServer = http.createServer(app);

// SOCKET.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
initializeSocketIO(io);

// Start server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (HTTP + WebSocket)`);
  });
});
