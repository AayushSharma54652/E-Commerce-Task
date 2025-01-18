import { Request, Response } from "express";
import asyncHandler from "express-async-handler"; // Helper for handling async routes
import OrderModel from "./order.schema"; // Import the Order model
import { createResponse } from "../common/helper/response.hepler"; // Utility function for consistent responses // Import the IOrderDocument interface
import { OrderStatus } from "./order.dto"; // Import OrderStatus enum for status updates

// Create a new order
export const createOrderHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { items, totalAmount, shippingAddress } = req.body;
  const userId = req.user?._id; // Assuming the user is authenticated

  if (!userId) {
    res.status(401).send(createResponse(null, "User is not authenticated"));
    return;
  }

  // Create a new order document
  const newOrder = new OrderModel({
    user: userId,
    items,
    totalAmount,
    shippingAddress,
    status: OrderStatus.PENDING, // Default status is PENDING
  });

  // Save the order
  const order = await newOrder.save();
  res.status(201).send(createResponse(order, "Order created successfully"));
});

// Get a specific order by its ID
export const getOrderByIdHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const orderId = req.params.id;
  const userId = req.user?._id;

  const order = await OrderModel.findOne({ _id: orderId, user: userId });

  if (!order) {
    res.status(404).send(createResponse(null, "Order not found"));
    return;
  }

  res.send(createResponse(order, "Order fetched successfully"));
});

// Get all orders of a user
export const getAllOrdersHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;

  const orders = await OrderModel.find({ user: userId });

  if (orders.length === 0) {
    res.status(404).send(createResponse(null, "No orders found for the user"));
    return;
  }

  res.send(createResponse(orders, "Orders fetched successfully"));
});

// Update order status (e.g., from Pending to Shipped)
export const updateOrderStatusHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const orderId = req.params.id;
  const { status } = req.body; // The new status to update (e.g., 'shipped', 'delivered', etc.)

  if (!Object.values(OrderStatus).includes(status)) {
    res.status(400).send(createResponse(null, "Invalid status"));
    return;
  }

  const order = await OrderModel.findByIdAndUpdate(
    orderId,
    { status, updatedAt: new Date() },
    { new: true }
  );

  if (!order) {
    res.status(404).send(createResponse(null, "Order not found"));
    return;
  }

  res.send(createResponse(order, "Order status updated successfully"));
});

// Delete an order (if necessary, e.g., if the user wants to cancel it)
export const deleteOrderHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const orderId = req.params.id;
  const userId = req.user?._id;

  const order = await OrderModel.findOneAndDelete({ _id: orderId, user: userId });

  if (!order) {
    res.status(404).send(createResponse(null, "Order not found or cannot be deleted"));
    return;
  }

  res.send(createResponse(null, "Order deleted successfully"));
});

export const getOrderStatusHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const orderId = req.params.id;
    const userId = req.user?._id; // Assuming the user is authenticated
  
    // Find the order by ID and user
    const order = await OrderModel.findOne({ _id: orderId, user: userId });
  
    if (!order) {
      res.status(404).send(createResponse(null, "Order not found"));
      return;
    }
  
    // Return the order status
    res.send(createResponse({ status: order.status }, "Order status fetched successfully"));
  });