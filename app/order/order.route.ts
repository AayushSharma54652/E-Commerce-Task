import { Router } from "express";
import { createOrderHandler, getOrderByIdHandler, getAllOrdersHandler, updateOrderStatusHandler, deleteOrderHandler, getOrderStatusHandler } from "./order.controller";
import { createOrder, updateOrderStatus, getOrderStatus } from "./order.validation";
import { catchError } from "../common/middleware/cath-error.middleware";
import { authMiddleware } from "../common/middleware/auth.middleware";
import { isAdmin } from "../common/middleware/AdminCheck.middleware";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  createOrder,
  catchError,
  createOrderHandler
);

router.get(
  "/:id",
  authMiddleware,
  getOrderByIdHandler
);

router.get(
  "/",
  authMiddleware,
  getAllOrdersHandler
);

router.put(
  "/update-status/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus,
  catchError,
  updateOrderStatusHandler
);

router.delete(
  "/delete/:id",
  authMiddleware,
  deleteOrderHandler
);

router.get(
  "/status/:id",
  authMiddleware,
  getOrderStatus,
  catchError,
  getOrderStatusHandler
);

export default router;
