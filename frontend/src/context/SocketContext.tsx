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
import { getMessages } from "@/lib/message.api";
import { getConversations } from "@/lib/conversation.api";

interface SocketContextType {
    currentUser: User | null;
    onlineUsers: User[];
    selectedUser: User | null;
    messages: Message[];
    conversations: Conversation[];
    setConversations: (conversations: Conversation[]) => void;
    typingUser: User | null;
    sendTyping: (receiverId: string) => void;
    stopTyping: (receiverId: string) => void;
    connectUser: (username: string) => void;
    selectUser: (user: User) => void;
    sendMessage: (message: string) => void;
}

export interface Conversation {
    conversationId: string;
    user: User;
    lastMessage: string;
    updatedAt: string;
}

const SocketContext = createContext<SocketContextType | null>(null);


export function SocketProvider({
    children,
}: {
    children: ReactNode;
}) {

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
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

            await new Promise<void>((resolve) => {
                socket.once("connect", () => resolve());
            });
        }

        socket.emit("join-chat", user);

        const conversations = await getConversations(user._id);

        setConversations(conversations);
    };

    const selectUser = async (user: User) => {
        const history = await getMessages(
            currentUser?._id as string,
            user._id
        );

        setMessages(history);

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
                conversations,
                setConversations,
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