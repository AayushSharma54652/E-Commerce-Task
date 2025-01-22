import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as orderService from "./order.service";
import { createResponse } from "../common/helper/response.hepler";
import { OrderStatus } from "./order.dto";

/**
 * Creates a new order for the authenticated user.
 * @async
 * @function createOrderHandler
 * @param {Request} req - The Express request object containing order details.
 * @param {Response} res - The Express response object to send the result.
 * @returns {Promise<void>} - A promise that resolves when the order is created.
 */
export const createOrderHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).send(createResponse(null, "User is not authenticated"));
    return;
  }

  const { items, totalAmount, shippingAddress } = req.body;

  const order = await orderService.createOrder(userId, items, totalAmount, shippingAddress);
  res.status(201).send(createResponse(order, "Order created successfully"));
});

/**
 * Fetches a specific order by its ID for the authenticated user.
 * @async
 * @function getOrderByIdHandler
 * @param {Request} req - The Express request object containing the order ID in parameters.
 * @param {Response} res - The Express response object to send the order data.
 * @returns {Promise<void>} - A promise that resolves when the order is fetched successfully or an error response is sent.
 */
export const getOrderByIdHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const orderId = req.params.id;

  if (!userId) {
    res.status(401).send(createResponse(null, "User is not authenticated"));
    return;
  }

  const order = await orderService.getOrderById(userId, orderId);

  if (!order) {
    res.status(404).send(createResponse(null, "Order not found"));
    return;
  }

  res.send(createResponse(order, "Order fetched successfully"));
});

/**
 * Fetches all orders for the authenticated user.
 * @async
 * @function getAllOrdersHandler
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object to send all orders.
 * @returns {Promise<void>} - A promise that resolves when all orders are fetched or an error response is sent.
 */
export const getAllOrdersHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).send(createResponse(null, "User is not authenticated"));
    return;
  }

  const orders = await orderService.getAllOrders(userId);

  if (!orders.length) {
    res.status(404).send(createResponse(null, "No orders found for the user"));
    return;
  }

  res.send(createResponse(orders, "Orders fetched successfully"));
});

/**
 * Updates the status of an order.
 * @async
 * @function updateOrderStatusHandler
 * @param {Request} req - The Express request object containing the order ID and new status in the body.
 * @param {Response} res - The Express response object to send the updated order.
 * @returns {Promise<void>} - A promise that resolves when the order status is updated successfully or an error response is sent.
 */
export const updateOrderStatusHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (!Object.values(OrderStatus).includes(status)) {
    res.status(400).send(createResponse(null, "Invalid status"));
    return;
  }

  const order = await orderService.updateOrderStatus(orderId, status);

  if (!order) {
    res.status(404).send(createResponse(null, "Order not found"));
    return;
  }

  res.send(createResponse(order, "Order status updated successfully"));
});

/**
 * Deletes an order for the authenticated user.
 * @async
 * @function deleteOrderHandler
 * @param {Request} req - The Express request object containing the order ID in the parameters.
 * @param {Response} res - The Express response object to send the result of the deletion.
 * @returns {Promise<void>} - A promise that resolves when the order is deleted successfully or an error response is sent.
 */
export const deleteOrderHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const orderId = req.params.id;

  if (!userId) {
    res.status(401).send(createResponse(null, "User is not authenticated"));
    return;
  }

  const deleted = await orderService.deleteOrder(userId, orderId);

  if (!deleted) {
    res.status(404).send(createResponse(null, "Order not found or cannot be deleted"));
    return;
  }

  res.send(createResponse(null, "Order deleted successfully"));
});

/**
 * Fetches the status of a specific order.
 * @async
 * @function getOrderStatusHandler
 * @param {Request} req - The Express request object containing the order ID in parameters.
 * @param {Response} res - The Express response object to send the order status.
 * @returns {Promise<void>} - A promise that resolves when the order status is fetched successfully or an error response is sent.
 */
export const getOrderStatusHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const orderId = req.params.id;

  if (!userId) {
    res.status(401).send(createResponse(null, "User is not authenticated"));
    return;
  }

  const status = await orderService.getOrderStatus(userId, orderId);

  if (!status) {
    res.status(404).send(createResponse(null, "Order not found"));
    return;
  }

  res.send(createResponse({ status }, "Order status fetched successfully"));
});
