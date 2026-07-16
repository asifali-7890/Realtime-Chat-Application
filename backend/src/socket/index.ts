import { Server, Socket } from "socket.io";
import { users, userSockets } from "../store/memory.store.js";
import { findOrCreateConversation } from "../services/conversation.service.js";
import { saveMessage } from "../services/message.service.js";
import { User } from "../models/user.model.js";

const typingUsers = new Map(); // userId -> { receiverId, timestamp }

export const initializeSocket = (io: Server) => {

    io.on("connection", (socket: Socket) => {
        console.log(`🟢 User Connected: ${socket.id}`);

        socket.on("join-room", (roomId) => {
            socket.join(roomId);

            io.to(roomId).emit("room-message", {
                text: "A new user joined the room.",
            });
        });


        socket.on("typing", (data: { to: string; from: string }) => {
            const receiverSocketId = userSockets.get(data.to);
            if (!receiverSocketId) return;
            io.to(receiverSocketId).emit("userTyping", data);
        });

        socket.on("stopTyping", (data: { to: string; from: string }) => {
            const receiverSocketId = userSockets.get(data.to);
            if (!receiverSocketId) return;
            io.to(receiverSocketId).emit("userStoppedTyping", data);
        });

        socket.on("private-message", async (data) => {
            try {
                const {
                    senderId,
                    receiverId,
                    message,
                } = data;

                // Find or create conversation
                const conversation = await findOrCreateConversation(
                    senderId,
                    receiverId
                );

                // Save message
                const savedMessage = await saveMessage(
                    conversation._id.toString(),
                    senderId,
                    message
                );

                const messagePayload = {
                    _id: savedMessage._id.toString(),
                    senderId: savedMessage.senderId.toString(),
                    receiverId,
                    message: savedMessage.message,
                    createdAt: savedMessage.createdAt,
                };

                const receiverSocketId = userSockets.get(receiverId);

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit(
                        "receive-message",
                        messagePayload
                    );
                }

                // Sender acknowledgement
                socket.emit("receive-message", messagePayload);
            } catch (error) {
                console.error(error);
            }
        });

        socket.on(
            "send-message",
            (data: { roomId: string; message: string; sender: string }) => {
                console.log(data);

                io.to(data.roomId).emit("receive-message", data);
            }
        );

        socket.on("join-chat", async (user) => {
            console.log("🟢 response from join-chat", user);

            await User.findByIdAndUpdate(user._id, {
                isOnline: true,
            });

            users.set(socket.id, {
                ...user,
                socketId: socket.id,
            });

            userSockets.set(user._id.toString(), socket.id);

            // console.log("🟢 users after join-chat", users);
            // console.log("🟢 userSockets after join-chat", userSockets);

            const onlineUsers = Array.from(users.values()).map((user) => ({
                _id: user._id,
                username: user.username,
            }));

            io.emit("online-users", onlineUsers);
        });

        socket.on("disconnect", async () => {
            const user = users.get(socket.id);

            if (user) {
                await User.findByIdAndUpdate(user._id, {
                    isOnline: false,
                });
                userSockets.delete(user._id.toString());
                users.delete(socket.id);
            }

            const onlineUsers = Array.from(users.values()).map((user) => ({
                _id: user._id,
                username: user.username,
            }));

            io.emit("online-users", onlineUsers);
        });

    });
};