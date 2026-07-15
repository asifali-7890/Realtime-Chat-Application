import { Types } from "mongoose";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";

export const saveMessage = async (
    conversationId: string,
    senderId: string,
    message: string
) => {
    const newMessage = await Message.create({
        conversationId: new Types.ObjectId(conversationId),
        senderId: new Types.ObjectId(senderId),
        message,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message,
    });

    return newMessage;
};

export const getMessages = async (conversationId: string) => {
    return await Message.find({
        conversationId: new Types.ObjectId(conversationId),
    }).sort({ createdAt: 1 });
};