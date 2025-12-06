import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createOrder(req, res) {
  try {
    const user = req.user; // Retrieved from protectRoute middleware
    const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Atomically reserve stock for all items
    const stockUpdates = [];
    for (const item of orderItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updated) {
        // Rollback previously decremented stock
        for (const prev of stockUpdates) {
          await Product.findByIdAndUpdate(prev.productId, {
            $inc: { stock: prev.quantity },
          });
        }
        return res.status(400).json({
          message: `Product ${item.name} not found or insufficient stock`,
        });
      }
      stockUpdates.push({
        productId: item.product._id,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      user: user._id,
      clerkId: user.clerkId,
      orderItems,
      shippingAddress,
      paymentResult,
      totalPrice,
    });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserOrders(req, res) {
  try {
    const orders = await Order.find({ clerkId: req.user.clerkId })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    // check if each order has been reviewed

    const orderWithReviewStatus = await Promise.all(
      orders.map(async (order) => {
        const review = await Review.findOne({ order: order._id });
        return {
          ...order.toObject(),
          hasReviewed: !!review,
        };
      })
    );

    res.status(200).json({ orders: orderWithReviewStatus });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
