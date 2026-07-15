import { api } from "./api";

export const getConversations = async (userId: string) => {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
};