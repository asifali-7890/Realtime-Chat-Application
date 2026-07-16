import { User } from "../models/user.model.js";

export const createOrGetUser = async (username: string) => {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
        if (existingUser.isOnline) {
            throw new Error("USER_ALREADY_ONLINE");
        }

        return existingUser;
    }

    return await User.create({
        username,
        isOnline: false,
    });
};



// getAllUsers.service.ts

export const getAllUsers = async (currentUserId: string) => {
    return User.find({
        _id: { $ne: currentUserId },
    }).select("_id username isOnline");
};