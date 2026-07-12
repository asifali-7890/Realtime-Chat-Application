"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export const useSocket = () => {
    useEffect(() => {
        socket.connect();

        socket.emit("join-chat", {
            id: "user-1",
            username: "Asif",
        });

        socket.emit("send-message", {
            roomId: "room-1",
            sender: "Asif",
            message: "Hello Rahul",
        });

        socket.on("receive-message", (data) => {
            console.log(data);
        });

        socket.emit("private-message", {
            senderId: "user-1",
            receiverId: "user-2",
            message: "Hello Rahul!",
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return socket;
};