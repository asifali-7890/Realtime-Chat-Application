import { Types } from "mongoose";
import { Conversation } from "../models/conversation.model.js";

export const findConversation = async (
    senderId: string,
    receiverId: string
) => {
    return await Conversation.findOne({
        participants: {
            $all: [
                new Types.ObjectId(senderId),
                new Types.ObjectId(receiverId),
            ],
        },
    });
};

export const createConversation = async (
    senderId: string,
    receiverId: string
) => {
    return await Conversation.create({
        participants: [
            new Types.ObjectId(senderId),
            new Types.ObjectId(receiverId),
        ],
        lastMessage: "",
    });
};

export const findOrCreateConversation = async (
    senderId: string,
    receiverId: string
) => {
    let conversation = await findConversation(senderId, receiverId);

    if (!conversation) {
        conversation = await createConversation(senderId, receiverId);
    }

    return conversation;
};

export const getUserConversations = async (
    userId: string
) => {
    return await Conversation.find({
        participants: userId,
    })
        .populate("participants", "username isOnline")
        .sort({ updatedAt: -1 });
};