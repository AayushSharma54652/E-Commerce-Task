import OrderModel from "./order.schema";
import { OrderStatus } from "./order.dto";

/**
 * Creates a new order for a user.
 * @async
 * @param {string} userId - The ID of the user placing the order.
 * @param {any[]} items - The list of items in the order.
 * @param {number} totalAmount - The total amount of the order.
 * @param {string} shippingAddress - The shipping address for the order.
 * @returns {Promise<any>} - A promise that resolves to the created order.
 */
export const createOrder = async (
  userId: string,
  items: any[],
  totalAmount: number,
  shippingAddress: string
) => {
  const newOrder = new OrderModel({
    user: userId,
    items,
    totalAmount,
    shippingAddress,
    status: OrderStatus.PENDING,
  });

  return await newOrder.save();
};

/**
 * Fetches a specific order by its ID for a user.
 * @async
 * @param {string} userId - The ID of the user.
 * @param {string} orderId - The ID of the order to fetch.
 * @returns {Promise<any | null>} - A promise that resolves to the order or null if not found.
 */
export const getOrderById = async (userId: string, orderId: string) => {
  return await OrderModel.findOne({ _id: orderId, user: userId });
};

/**
 * Fetches all orders for a user.
 * @async
 * @param {string} userId - The ID of the user.
 * @returns {Promise<any[]>} - A promise that resolves to an array of orders.
 */
export const getAllOrders = async (userId: string) => {
  return await OrderModel.find({ user: userId });
};

/**
 * Updates the status of an order.
 * @async
 * @param {string} orderId - The ID of the order to update.
 * @param {OrderStatus} status - The new status of the order.
 * @returns {Promise<any | null>} - A promise that resolves to the updated order or null if not found.
 */
export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  return await OrderModel.findByIdAndUpdate(
    orderId,
    { status, updatedAt: new Date() },
    { new: true }
  );
};

/**
 * Deletes a specific order for a user.
 * @async
 * @param {string} userId - The ID of the user.
 * @param {string} orderId - The ID of the order to delete.
 * @returns {Promise<boolean>} - A promise that resolves to true if the order was deleted, false otherwise.
 */
export const deleteOrder = async (userId: string, orderId: string) => {
  const result = await OrderModel.findOneAndDelete({ _id: orderId, user: userId });
  return result !== null;
};

/**
 * Fetches the status of a specific order for a user.
 * @async
 * @param {string} userId - The ID of the user.
 * @param {string} orderId - The ID of the order.
 * @returns {Promise<OrderStatus | null>} - A promise that resolves to the status of the order or null if not found.
 */
export const getOrderStatus = async (userId: string, orderId: string) => {
  const order = await OrderModel.findOne({ _id: orderId, user: userId });
  return order ? order.status : null;
};
