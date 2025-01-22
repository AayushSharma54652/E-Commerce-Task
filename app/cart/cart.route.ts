import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import {
  addToCartValidation,
  updateCartItemValidation,
  removeFromCartValidation,
} from "./cart.validation";
import {
  addProductToCart,
  removeProductFromCart,
  updateProductQuantity,
  getUserCart ,
} from "./cart.controller";
import { authMiddleware } from "../common/middleware/auth.middleware";
const router = Router();

/**
 * Route to get or create a cart for the user
 */
router.get("/", authMiddleware, catchError, getUserCart);

/**
 * Route to add a product to the user's cart
 */
router.post(
  "/add-to-cart",
  authMiddleware,
  addToCartValidation,
  catchError,
  addProductToCart
);

/**
 * Route to remove a product from the user's cart
 */
router.delete(
  "/remove/:productId",
  authMiddleware,
  removeFromCartValidation,
  catchError,
  removeProductFromCart
);

/**
 * Route to update the quantity of a product in the user's cart
 */
router.put(
  "/update/:productId",
  authMiddleware,
  updateCartItemValidation,
  catchError,
  updateProductQuantity
);

/**
 * Route to view the user's cart
 */

export default router;
