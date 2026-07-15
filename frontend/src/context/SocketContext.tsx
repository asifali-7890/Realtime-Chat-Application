"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback,
} from "react";
import { User } from "@/types/user";
import { socket } from "@/lib/socket";
import { Message } from "@/types/message";
import { createUser } from "@/lib/api";

interface SocketContextType {
    currentUser: User | null;
    onlineUsers: User[];
    selectedUser: User | null;
    messages: Message[];
    typingUser: User | null;
    sendTyping: (receiverId: string) => void;
    stopTyping: (receiverId: string) => void;
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
    const [typingUser, setTypingUser] = useState<User | null>(null);


    const sendTyping = useCallback((receiverId: string) => {
        if (!currentUser || !receiverId) return;
        socket.emit("typing", {
            to: receiverId,
            from: currentUser._id,
        });
    }, [currentUser]);

    const stopTyping = useCallback((receiverId: string) => {
        if (!currentUser || !receiverId) return;
        socket.emit("stopTyping", {
            to: receiverId,
            from: currentUser._id,
        });
    }, [currentUser]);

    const connectUser = async (username: string) => {
        const user = await createUser(username);
        setCurrentUser(user);

        if (!socket.connected) {
            socket.connect();
        }
    };

    const selectUser = (user: User) => {
        setSelectedUser(user);
    };

    const sendMessage = (message: string) => {
        console.log(currentUser);
        console.log(selectedUser);

        if (!currentUser || !selectedUser) return;

        socket.emit("private-message", {
            senderId: currentUser._id,
            receiverId: selectedUser._id,
            message,
        });
    };

    useEffect(() => {
        if (!currentUser) return;

        const registerUser = () => {
            socket.emit("join-chat", currentUser);
        };

        socket.on("connect", registerUser);

        if (socket.connected) {
            registerUser();
        }

        return () => {
            socket.off("connect", registerUser);
        };
    }, [currentUser]);

    useEffect(() => {
        socket.on("online-users", (users: User[]) => {
            setOnlineUsers(users);
        });

        socket.on("receive-message", (message: Message) => {
            console.log("🟢 receive-message ran", message);
            setMessages((prev) => [...prev, message]);
        });

        socket.on("userTyping", (data: { from: string }) => {
            setTypingUser({ _id: data.from, username: "", isOnline: true });
        });

        socket.on("userStoppedTyping", (data: { from: string }) => {
            setTypingUser((prev) => (prev?._id === data.from ? null : prev));
        });

        return () => {
            socket.off("online-users");
            socket.off("receive-message");
            socket.off("userTyping");
            socket.off("userStoppedTyping");
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
                typingUser,
                sendTyping,
                stopTyping,
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