import { Router } from "express";
import { getConversations, loadMessages } from "../controllers/message.controller.js";

const router = Router();

router.get(
    "/:senderId/:receiverId",
    loadMessages
);

router.get("/:userId", getConversations);

export default router;