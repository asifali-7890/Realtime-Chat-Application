
import { api } from "./api";

export const getMessages = async (
    senderId: string,
    receiverId: string
) => {
    const response = await api.get(
        `/messages/${senderId}/${receiverId}`
    );

    return response.data;
};