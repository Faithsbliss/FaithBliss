// src/socket/socket.ts
// Realtime messaging powered by Firestore.

import { Server, Socket } from "socket.io";
import { Timestamp } from "firebase-admin/firestore";
import { protectSocket } from "../middleware/authMiddleware";
import { matchesCollection, messagesCollection } from "../config/firebase";

interface AuthenticatedSocket extends Socket {
  user?: { id: string };
}

// In-memory map of connected user IDs to socket IDs.
// In production, replace with Redis or another distributed store.
const usersSocketMap = new Map<string, string>();

export const initializeSocketIO = (io: Server) => {
  console.log("Socket.io server initialized and listening.");

  io.use(protectSocket as any);

  io.on("connection", (socket: AuthenticatedSocket) => {
    const userId = socket.user!.id;
    console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);

    usersSocketMap.set(userId, socket.id);
    socket.join(userId);

    socket.on("joinRoom", (data: { matchId: string }) => {
      if (data?.matchId) {
        socket.join(data.matchId);
        console.log(`User ${userId} joined match room: ${data.matchId}`);
      }
    });

    socket.on("leaveRoom", (data: { matchId: string }) => {
      if (data?.matchId) {
        socket.leave(data.matchId);
        console.log(`User ${userId} left match room: ${data.matchId}`);
      }
    });

    socket.on(
      "sendMessage",
      async (data: { receiverId: string; content: string }) => {
        const { receiverId, content } = data || {};

        if (!receiverId || !content) {
          return socket.emit(
            "error",
            "Message must have a receiver ID and content.",
          );
        }

        try {
          // Locate the match document containing both users.
          const matchSnapshot = await matchesCollection
            .where("users", "array-contains", userId)
            .get();

          const matchDoc = matchSnapshot.docs.find((doc) => {
            const users: string[] = doc.data()?.users || [];
            return users.includes(receiverId);
          });

          if (!matchDoc) {
            return socket.emit(
              "error",
              "Cannot send message: Match not found.",
            );
          }

          const matchId = matchDoc.id;
          const newMessageRef = messagesCollection.doc();
          const messagePayload = {
            matchId,
            senderId: userId,
            receiverId,
            content,
            isRead: false,
            readBy: [userId],
            createdAt: Timestamp.now(),
          };

          await newMessageRef.set(messagePayload);

          const messageToSend = {
            id: newMessageRef.id,
            ...messagePayload,
            createdAt: messagePayload.createdAt.toDate().toISOString(),
          };

          io.to(matchId).emit("newMessage", messageToSend);

          if (userId !== receiverId) {
            io.to(receiverId).emit("notification", {
              type: "message",
              matchId,
              message: `New message from user ${userId}`,
            });
          }
        } catch (error) {
          console.error("Error sending message:", error);
          socket.emit("error", "Failed to process message on server.");
        }
      },
    );

    socket.on(
      "userTyping",
      (data: { receiverId: string; isTyping: boolean }) => {
        if (!data?.receiverId) return;
        io.to(data.receiverId).emit("userTyping", {
          userId,
          isTyping: !!data.isTyping,
        });
      },
    );

    socket.on("disconnect", () => {
      console.log(
        `User disconnected: ${userId} (Socket ID: ${socket.id})`,
      );
      usersSocketMap.delete(userId);
    });
  });
};
