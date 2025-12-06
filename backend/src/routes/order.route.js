import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createOrder, getUserOrders } from "../controllers/order.controller.js";

const router = Router();

router.use(protectRoute);

// Create a new order
router.post("/", createOrder);
// Get all orders for the authenticated user
router.get("/", getUserOrders);

export default router;
