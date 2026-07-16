// lib/user.api.ts

import { User } from "@/types/user";
import { api } from "./api";

export const getUsers = async (
    currentUserId: string
): Promise<User[]> => {
    const response = await api.get(`/users/${currentUserId}`);

    return response.data;
};