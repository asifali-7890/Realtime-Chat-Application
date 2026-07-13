import { Server, Socket } from "socket.io";
import { users, userSockets } from "../store/memory.store.js";

const typingUsers = new Map(); // userId -> { receiverId, timestamp }

export const initializeSocket = (io: Server) => {
    // Track typing users

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

        socket.on(
            "private-message",
            (data: {
                senderId: string;
                receiverId: string;
                message: string;
            }) => {
                const receiverSocketId = userSockets.get(data.receiverId);

                if (!receiverSocketId) {
                    console.log("Receiver is offline");
                    return;
                }

                // Only deliver to receiver — sender already shows the message locally
                io.to(receiverSocketId).emit("receive-message", {
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    message: data.message,
                });

                console.log("Private message sent");
            }
        );

        socket.on(
            "send-message",
            (data: { roomId: string; message: string; sender: string }) => {
                console.log(data);

                io.to(data.roomId).emit("receive-message", data);
            }
        );

        socket.on("join-chat", (user) => {
            users.set(socket.id, {
                ...user,
                socketId: socket.id,
            });

            userSockets.set(user.id, socket.id);

            const onlineUsers = Array.from(users.values()).map((user) => ({
                id: user.id,
                username: user.username,
            }));

            io.emit("online-users", onlineUsers);
        });

        socket.on("disconnect", () => {
            const user = users.get(socket.id);

            if (user) {
                userSockets.delete(user.id);
            }

            users.delete(socket.id);

            const onlineUsers = Array.from(users.values()).map((user) => ({
                id: user.id,
                username: user.username,
            }));

            io.emit("online-users", onlineUsers);
        });

    });
};