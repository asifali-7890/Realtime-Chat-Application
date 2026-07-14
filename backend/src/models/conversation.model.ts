import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],

        lastMessage: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export const Conversation = model(
    "Conversation",
    conversationSchema
);