import "dotenv/config.js";

import cors from "cors";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import checkoutVnpay from "./controllers/vnpay.js";
import routerAddress from "./routes/address.js";
import routeranalytics from "./routes/anilytic.js";
import routerCart from "./routes/cart.js";
import routerCategory from "./routes/category.js";
import routerColor from "./routes/color.js";
import routerComment from "./routes/comment.js";
import routerContact from "./routes/contact.js";
import routerCustomer from "./routes/customer.js";
import routerFavoriteProduct from "./routes/favoriteProduct.js";
import routerimage_news from "./routes/image_news.js";
import routerImageProduct from "./routes/imageProduct.js";
import routerInformation from "./routes/information.js";
import routerMessage from "./routes/message.js";
import orderRoute from "./routes/orderRoute.js";
import paymentRouter from "./routes/payment.router.js";
import routerProduct from "./routes/product.js";
import routerRole from "./routes/role.js";
import saleRouter from "./routes/sale.router.js";
import routerSize from "./routes/size.js";
import routerNews from "./routes/tb_new.js";
import routerUser from "./routes/user.js";
import routerPayment from "./routes/vnpay.router.js";
import routerWarehose from "./routes/warehose.js";
//config
const app = express();
const API_DB = process.env.API_DB;
// middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
// router
app.use("/api", routerCategory);
app.use("/api", routerContact);
app.use("/api", routerInformation);
app.use("/api", routerCart);
app.use("/api", routerFavoriteProduct);
app.use("/api", routerComment);
app.use("/api", routerAddress);
app.use("/api", routerNews);
app.use("/api", routerRole);
app.use("/api", orderRoute);
app.use("/api", routerNews);
app.use("/api", routerimage_news);
app.use("/api", routerImageProduct);
app.use("/api", routerPayment);
app.use("/api/payments", paymentRouter);
app.use("/api/sales", saleRouter);
app.use("/api", routerProduct);
app.use("/api", routerUser);
app.use("/api", routerSize);
app.use("/api", routerColor);
app.use("/api", routerCustomer);
app.use("/api", routerWarehose);
app.use("/api", routeranalytics);
app.post("/create-checkout-vnpay", checkoutVnpay.payment);
app.use("/api", routerMessage);

// database config
mongoose
	.connect(API_DB)
	.then(() => {
		console.log("Database connected");
	})
	.catch(() => {
		console.log("Database connect failed");
	});
export const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*", // Cho phép tất cả các origin trong môi trường phát triển
		methods: ["GET", "POST"],
		transports: ["websocket", "polling"],
		pingTimeout: 60000,
		pingInterval: 25000,
	},
});

// Schema tin nhắn
const messageSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	receiver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const Message = mongoose.model("Message", messageSchema);

// Lưu trữ kết nối socket của người dùng
const userSockets = new Map();

io.on("connection", (socket) => {
	console.log("New client connected");

	// Xử lý khi người dùng kết nối
	socket.on("user_connected", (userId) => {
		userSockets.set(userId, socket.id);
		console.log(`User ${userId} connected`);
	});

	// Xử lý khi nhận tin nhắn mới
	socket.on("send_message", async ({ senderId, receiverId, content }) => {
		try {
			const message = new Message({
				sender: senderId,
				receiver: receiverId,
				content,
			});
			const result = await message.save();
			console.log("🚀 ~ socket.on ~ result:", result);

			// Gửi tin nhắn đến người nhận nếu họ đang online
			// const receiverSocketId = userSockets.get(receiverId);
			// if (receiverSocketId) {
			// 	io.to(receiverSocketId).emit("new_message", message);
			// }
			io.emit("new_message", message);

			// Gửi xác nhận về cho người gửi
			socket.emit("message_sent", message);
		} catch (error) {
			console.error("Error saving message:", error);
			socket.emit("message_error", { error: "Failed to send message" });
		}
	});

	// Xử lý khi người dùng ngắt kết nối
	socket.on("disconnect", () => {
		console.log("Client disconnected");
		// Xóa socket ID của người dùng khi họ ngắt kết nối
		for (const [userId, socketId] of userSockets.entries()) {
			if (socketId === socket.id) {
				userSockets.delete(userId);
				console.log(`User ${userId} disconnected`);
				break;
			}
		}
	});
});

// export const viteNodeApp = app;
server.listen(8080, (req, res) => {
	try {
		console.log("User Agent:");
	} catch (error) {
		console.log(error);
	}
	console.log(`Server is running on 8080 ${8080} `);
});
