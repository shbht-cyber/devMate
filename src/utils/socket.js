const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: ["http://localhost:5173", "http://192.168.1.4:5173"],
    },
  });

  io.on("connection", (socket) => {
    // handle events here
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, photoUrl, userId, targetUserId, text }) => {
        //save msg to db
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          // check if userId and targetId are friends
          const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
              {
                fromUserId: userId,
                toUserId: targetUserId,
                status: "accepted",
              },
              {
                fromUserId: targetUserId,
                toUserId: userId,
                status: "accepted",
              },
            ],
          });

          if (!existingConnectionRequest) {
            throw new Error("Status is not connected");
          }

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            photoUrl,
            text,
          });
        } catch (err) {
          console.log("Error: " + err.message);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
