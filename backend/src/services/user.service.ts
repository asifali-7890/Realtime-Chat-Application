import { User } from "../models/user.model.js";

export const createOrGetUser = async (username: string) => {
    let user = await User.findOne({ username });

    if (user) {
        return user;
    }

    user = await User.create({
        username,
    });

    return user;
};