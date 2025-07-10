import Conversation from "../models/conversation.js";

export const getConversationByCustomerId = async (req, res) => {
	const { customerId } = req.params;

	try {
		const conversation = await Conversation.find({ customerId });
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
};

export const getAllConversations = async (req, res) => {
	try {
		const conversations = await Conversation.find();
		return res.status(200).json({
			message: "Get all conversations success",
			success: true,
			conversations,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Get all conversations failed",
			success: false,
		});
	}
};
