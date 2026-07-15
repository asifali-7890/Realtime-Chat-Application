import type { Request, Response } from "express";
import {
    findConversation,
    getUserConversations,
} from "../services/conversation.service.js";
import {
    getMessages,
} from "../services/message.service.js";

export const loadMessages = async (
    req: Request,
    res: Response
) => {
    try {
        const { senderId, receiverId } = req.params;

        const conversation = await findConversation(
            senderId as string,
            receiverId as string
        );

        if (!conversation) {
            return res.json([]);
        }

        const messages = await getMessages(
            conversation._id.toString()
        );

        res.json(messages);
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
};

export const getConversations = async (
    req: Request,
    res: Response
) => {
    try {
        const { userId } = req.params;
        console.log(userId);
        const conversations = await getUserConversations(userId as string);
        console.log(conversations);

        const result = conversations.map((conversation) => {
            const otherUser = conversation.participants.find(
                (user) => user._id.toString() !== userId
            );

            return {
                conversationId: conversation._id,
                user: otherUser,
                lastMessage: conversation.lastMessage,
                updatedAt: conversation.updatedAt,
            };
        });

        res.json(result);
    } catch {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
};