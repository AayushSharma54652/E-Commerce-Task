import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import {
  addToCartValidation,
  updateCartItemValidation,
  removeFromCartValidation,
  getCartValidation,
} from "./cart.validation";
import {
  getOrCreateCartHandler,
  addToCartHandler,
  removeFromCartHandler,
  updateItemQuantityHandler,
  viewCartHandler,
  clearCartHandler,
} from "./cart.controller";
import { authMiddleware } from "../common/middleware/auth.middleware";

const router = Router();


router.get("/", authMiddleware, catchError, getOrCreateCartHandler);


router.post(
  "/add-to-cart",
  authMiddleware,
  addToCartValidation,
  catchError,
  addToCartHandler
);


router.delete(
  "/remove/:productId",
  authMiddleware,
  removeFromCartValidation,
  catchError,
  removeFromCartHandler
);


router.put(
  "/update/:productId",
  authMiddleware,
  updateCartItemValidation,
  catchError,
  updateItemQuantityHandler
);


router.get(
  "/view-cart",
  authMiddleware,
  getCartValidation,
  catchError,
  viewCartHandler
);


router.delete("/clear-cart", authMiddleware, catchError, clearCartHandler);

export default router;
