import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { initializeSocketIO } from "./socket/socket";

const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
].filter((origin): origin is string => Boolean(origin));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
initializeSocketIO(io);

if (!process.env.VERCEL) {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (HTTP + WebSocket)`);
  });
}

export { httpServer, io };
