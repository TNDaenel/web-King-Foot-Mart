import express from "express";
import { Message } from "../app.js";

const router = express.Router();

// export const getConversationByCustomerId = async (req, res) => {
// 	const { customerId } = req.params;

// 	try {
// 		const conversation = await Message.find({ customerId });
// 		return res.status(200).json({
// 			message: "Get conversation success",
// 			success: true,
// 			conversation,
// 		});
// 	} catch (error) {
// 		return res.status(500).json({
// 			message: "Get conversation failed",
// 			success: false,
// 		});
// 	}
// };

router.get("/conversation/:customerId", async (req, res) => {
	const { customerId } = req.params;

	try {
		const conversation = await Message.find({ sender: customerId });
		return res.status(200).json({
			message: "Get conversation success",
			success: true,
			conversation,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Get conversation failed",
			success: false,
		});
	}
});

// get all sender chat
router.get("/conversations", async (req, res) => {
	const conversations = await Message.find({}).populate("sender");
	return res.status(200).json({
		message: "Get conversations success",
		success: true,
		conversations,
	});
});

// get all sender chat
router.get("/conversations/users", async (req, res) => {
	const conversations = await Message.find({}).populate("sender");

	// set unique sender
	const uniqueSender = [
		...new Set(conversations.map((item) => item.sender)),
	].filter((item) => item && item.role !== "6545036de84d7e9cc42a5050");
	return res.status(200).json({
		message: "Get conversations success",
		success: true,
		users: uniqueSender,
	});
});

// get all message by sender
router.get("/messages/:sender", async (req, res) => {
	const { sender } = req.params;
	const messages = await Message.find({ sender }).populate("sender");
	return res.status(200).json({
		message: "Get messages success",
		success: true,
		messages,
	});
});

export default router;
