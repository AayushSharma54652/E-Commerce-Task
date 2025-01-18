import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware"; // Error handler middleware
import {
  addToCartValidation,
  updateCartItemValidation,
  removeFromCartValidation,
  getCartValidation,
} from "./cart.validation"; // Validation logic
import {
  getOrCreateCartHandler,
  addToCartHandler,
  removeFromCartHandler,
  updateItemQuantityHandler,
  viewCartHandler,
  clearCartHandler,
} from "./cart.controller"; // Controller methods
import { authMiddleware } from "../common/middleware/auth.middleware"; // Auth middleware

const router = Router();

// Route for creating or getting the user's cart (if it already exists)
router.get(
  "/",
  authMiddleware, // Apply authMiddleware here to ensure only logged-in users can access
  catchError, // Catch any errors
  getOrCreateCartHandler // Controller for getting or creating cart
);

// Route for adding an item to the user's cart
router.post(
  "/add-to-cart",
  authMiddleware, // Apply authMiddleware here to ensure only logged-in users can access
  addToCartValidation, // Validation for adding an item to the cart
  catchError, // Catch any errors
  addToCartHandler // Controller for adding the item
);

// Route for removing an item from the user's cart
router.delete(
  "/remove/:productId",
  authMiddleware, // Apply authMiddleware here to ensure only logged-in users can access
  removeFromCartValidation, // Validation for removing an item
  catchError, // Catch any errors
  removeFromCartHandler // Controller for removing the item
);

// Route for updating the quantity of an item in the cart
router.put(
  "/update/:productId",
  authMiddleware, // Apply authMiddleware here to ensure only logged-in users can access
  updateCartItemValidation, // Validation for updating the item quantity
  catchError, // Catch any errors
  updateItemQuantityHandler // Controller for updating the item quantity
);

// Route for viewing the user's cart
router.get(
  "/view-cart",
  authMiddleware, // Apply authMiddleware here to ensure only logged-in users can access
  getCartValidation, // Validation for viewing the cart
  catchError, // Catch any errors
  viewCartHandler // Controller for viewing the cart
);

// Route for clearing the user's cart
router.delete(
  "/clear-cart",
  authMiddleware, // Apply authMiddleware here to ensure only logged-in users can access
  catchError, // Catch any errors
  clearCartHandler // Controller for clearing the cart
);

export default router;
