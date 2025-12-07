import express from "express";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/ordercontroller.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrders);
orderRouter.put("/:orderId",updateOrderStatus);

export default orderRouter;