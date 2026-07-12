"use client";

import { User } from "@/types/user";

interface Props {
    users: User[];
    selectedUser: User | null;
    onSelect: (user: User) => void;
}

export default function OnlineUsers({
    users,
    selectedUser,
    onSelect,
}: Props) {
    return (
        <div>
            <h3>Online Users</h3>

            {users.map((user) => (
                <button
                    key={user.id}
                    onClick={() => onSelect(user)}
                    style={{
                        display: "block",
                        marginBottom: "10px",
                        background:
                            selectedUser?.id === user.id
                                ? "lightblue"
                                : "white",
                    }}
                >
                    {user.username}
                </button>
            ))}
        </div>
    );
}