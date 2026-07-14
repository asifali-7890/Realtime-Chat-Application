import type { Request, Response } from "express";
import { createOrGetUser } from "../services/user.service.js";

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
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};