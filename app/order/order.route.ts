import { Router } from "express";
import { createOrderHandler, getOrderByIdHandler, getAllOrdersHandler, updateOrderStatusHandler, deleteOrderHandler, getOrderStatusHandler } from "./order.controller"; // Import controller methods
import { createOrder, updateOrderStatus, getOrderStatus } from "./order.validation"; // Import validation logic
import { catchError } from "../common/middleware/cath-error.middleware";// Middleware for validating requests
import { authMiddleware } from "../common/middleware/auth.middleware"; // Middleware for authentication
import { isAdmin } from "../common/middleware/AdminCheck.middleware";

const router = Router();

// Route to create a new order (protected route)
router.post(
  "/create",
  authMiddleware, // Ensure the user is authenticated
  createOrder, // Apply validation for creating order
  catchError, // Middleware to validate request after applying validation rules
  createOrderHandler // Controller to handle creating the order
);

// Route to get a specific order by its ID (protected route)
router.get(
  "/:id",
  authMiddleware, // Ensure the user is authenticated
  getOrderByIdHandler // Controller to handle getting the order by ID
);

// Route to get all orders of a user (protected route)
router.get(
  "/",
  authMiddleware, // Ensure the user is authenticated
  getAllOrdersHandler // Controller to handle getting all orders of the user
);

// Route to update the status of an order (protected route)
router.put(
  "/update-status/:id",
  authMiddleware, // Ensure the user is authenticated
  isAdmin,
  updateOrderStatus, // Apply validation for updating order status
  catchError, // Middleware to validate request after applying validation rules
  updateOrderStatusHandler // Controller to handle updating order status
);

// Route to delete an order (protected route)
router.delete(
  "/delete/:id",
  authMiddleware, // Ensure the user is authenticated
  deleteOrderHandler // Controller to handle deleting the order
);

// Route to get the status of a specific order (protected route)
router.get(
  "/status/:id",
  authMiddleware, // Ensure the user is authenticated
  getOrderStatus, // Apply validation for getting the order status
  catchError, // Middleware to validate request after applying validation rules
  getOrderStatusHandler // Controller to handle getting the order status
);

export default router;
