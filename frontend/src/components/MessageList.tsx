"use client";

import { Message } from "@/types/message";

interface Props {
    messages: Message[];
    currentUserId: string;
}

export default function MessageList({
    messages,
    currentUserId,
}: Props) {
    return (
        <div
            style={{
                border: "1px solid gray",
                minHeight: 300,
                minWidth: 300,
                padding: 10,
                borderRadius: 10,
                backgroundColor: "#f0f0f0",
            }}
        >
            {messages.map((msg, index) => {
                const isMine = msg.senderId === currentUserId;

                return (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            justifyContent: isMine
                                ? "flex-end"
                                : "flex-start",
                            marginBottom: 10,
                        }}
                    >
                        <div
                            style={{
                                maxWidth: 300,
                                wordWrap: "break-word",
                                padding: "8px 12px",
                                borderRadius: 10,
                                backgroundColor: isMine
                                    ? "#2563eb"
                                    : "#e5e7eb",
                                color: isMine ? "white" : "black",
                            }}
                        >
                            <strong>{isMine ? "Me" : "Them"}</strong>
                            <p style={{ margin: "4px 0 0" }}>{msg.message}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}