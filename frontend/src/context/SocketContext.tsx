"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { User } from "@/types/user";
import { socket } from "@/lib/socket";
import { Message } from "@/types/message";

interface SocketContextType {
    currentUser: User | null;
    onlineUsers: User[];
    selectedUser: User | null;
    messages: Message[];

    connectUser: (username: string) => void;
    selectUser: (user: User) => void;
    sendMessage: (message: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    const connectUser = (username: string) => {
        const user: User = {
            id: crypto.randomUUID(),
            username,
        };

        setCurrentUser(user);
        socket.connect();
        socket.emit("join-chat", user);
    };

    const selectUser = (user: User) => {
        setSelectedUser(user);
    };

    const sendMessage = (message: string) => {
        console.log(currentUser);
        console.log(selectedUser);

        if (!currentUser || !selectedUser) return;

        const payload: Message = {
            senderId: currentUser.id,
            receiverId: selectedUser.id,
            message,
        };

        // Show immediately for the sender (don't wait only on server echo)
        setMessages((prev) => [...prev, payload]);

        socket.emit("private-message", payload);
    };

    useEffect(() => {
        socket.on("online-users", (users: User[]) => {
            setOnlineUsers(users);
        });

        socket.on("receive-message", (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("online-users");
            socket.off("receive-message");
        };
    }, []);

    return (
        <SocketContext.Provider
            value={{
                currentUser,
                connectUser,
                onlineUsers,
                selectedUser,
                selectUser,
                messages,
                sendMessage,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
}

export function useSocketContext() {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error(
            "useSocketContext must be used inside SocketProvider"
        );
    }

    return context;
}