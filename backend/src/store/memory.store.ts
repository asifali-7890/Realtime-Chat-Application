export type User = {
    _id: string;
    username: string;
    socketId?: string;
    isOnline: boolean;
};

export const users = new Map<string, User>();

export const userSockets = new Map<string, string>();