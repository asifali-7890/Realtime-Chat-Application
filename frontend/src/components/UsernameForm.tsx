"use client";

import { useState } from "react";

type Props = {
    onConnect: (username: string) => void;
};

export default function UsernameForm({ onConnect }: Props) {
    const [username, setUsername] = useState("");

    return (
        <div>
            <input
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <button onClick={() => onConnect(username)}>
                Connect
            </button>
        </div>
    );
}