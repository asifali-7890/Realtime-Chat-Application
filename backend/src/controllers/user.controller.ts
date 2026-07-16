import type { Request, Response } from "express";
import { createOrGetUser, getAllUsers } from "../services/user.service.js";

export const createUser = async (
    req: Request,
    res: Response
) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                message: "Username is required",
            });
        }

        const user = await createOrGetUser(username);

        return res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error && error.message === "USER_ALREADY_ONLINE") {
            return res.status(409).json({
                message: "Username is already logged in.",
            });
        }

        res.status(500).json({
            message: "Something went wrong.",
        });
    }
};




export const getUsers = async (
    req: Request,
    res: Response
) => {
    try {
        const { currentUserId } = req.params;

        const users = await getAllUsers(currentUserId as string);

        res.json(users);
    } catch {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
};