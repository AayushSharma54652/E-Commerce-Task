import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as cartService from "./cart.service";
import { createResponse } from "../common/helper/response.hepler";
import jwt from "jsonwebtoken";

interface DecodedToken {
  _id: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  name: string;
}

/**
 * Extracts user information from the refresh token.
 * @param {Request} req - The HTTP request object.
 * @returns {DecodedToken | null} Decoded token information or null if invalid.
 */
const getUserFromToken = (req: Request): DecodedToken | null => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return null;

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as DecodedToken;

    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Handles the retrieval or creation of a cart for the authenticated user.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */
export const getOrCreateCartHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = getUserFromToken(req);
  if (!user) {
    res.status(401).send(createResponse(null, "User not authenticated"));
    return;
  }

  let cart = await cartService.getCartByUserId(user._id);
  if (!cart) {
    const newCart = await cartService.createCart(user._id);
    res.send(createResponse(newCart, "New cart created successfully"));
    return;
  }

  res.send(createResponse(cart, "Cart retrieved successfully"));
});

/**
 * Handles adding an item to the user's cart.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */
export const addToCartHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = getUserFromToken(req);
  if (!user) {
    res.status(401).send(createResponse(null, "User not authenticated"));
    return;
  }

  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    res.status(400).send(createResponse(null, "Invalid productId or quantity"));
    return;
  }

  try {
    const updatedCart = await cartService.addItemToCart(user._id, productId, quantity);
    res.send(createResponse(updatedCart, "Item added to cart successfully"));
  } catch (error) {
    res.status(500).send(createResponse(null, "Error adding item to cart"));
  }
});

/**
 * Handles removing an item from the user's cart.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */
export const removeFromCartHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).send(createResponse(null, "User not authenticated"));
    return;
  }

  const userId = req.user._id;
  const { productId } = req.params;

  const updatedCart = await cartService.removeItemFromCart(userId, productId);

  res.send(createResponse(updatedCart, "Item removed from cart successfully"));
});

/**
 * Handles updating the quantity of an item in the user's cart.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */
export const updateItemQuantityHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).send(createResponse(null, "User not authenticated"));
    return;
  }

  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  const updatedCart = await cartService.updateItemQuantity(userId, productId, quantity);

  res.send(createResponse(updatedCart, "Item quantity updated successfully"));
});

/**
 * Handles viewing the user's cart.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */
export const viewCartHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).send(createResponse(null, "User not authenticated"));
    return;
  }

  const userId = req.user._id;
  const cart = await cartService.getCartByUserId(userId);

  if (!cart) {
    res.status(404).send(createResponse(null, "Cart not found"));
    return;
  }

  res.send(createResponse(cart, "Cart retrieved successfully"));
});

/**
 * Handles clearing the user's cart.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */
export const clearCartHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).send(createResponse(null, "User not authenticated"));
    return;
  }

  const userId = req.user._id;

  const clearedCart = await cartService.clearCart(userId);

  res.send(createResponse(clearedCart, "Cart cleared successfully"));
});
