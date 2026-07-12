export type User = {
    id: string;
    username: string;
    socketId: string;
};

export const users = new Map<string, User>();

export const userSockets = new Map<string, string>();