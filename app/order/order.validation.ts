import { body, param } from "express-validator";

export const createOrder = [
  body("products")
    .isArray()
    .withMessage("Products must be an array")
    .custom((value) => value.every((product: any) => product.productId && product.quantity))
    .withMessage("Each product must have a productId and quantity")
    .custom((value) =>
      value.every((product: any) => typeof product.productId === "string" && typeof product.quantity === "number")
    )
    .withMessage("Each product must have productId as string and quantity as number"),
];

export const updateOrderStatus = [
  param("orderId")
    .isString()
    .withMessage("Order ID must be a string")
    .notEmpty()
    .withMessage("Order ID is required"),

  body("newStatus")
    .isString()
    .withMessage("New status must be a string")
    .isIn(["pending", "shipped", "delivered", "cancelled"])
    .withMessage("Status must be one of the following: pending, shipped, delivered, cancelled"),
];

export const getOrderStatus = [
  param("id")
    .isString()
    .withMessage("Order ID must be a string")
    .notEmpty()
    .withMessage("Order ID is required"),
];
