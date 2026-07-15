import axios from "axios";

export const createUser = async (username: string) => {
    const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to create user");
    }

    return response.json();
};


export const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});