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

// Helper function to get user from refresh token
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

// Controller to create or get user's cart
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

// Controller to add an item to the cart
export const addToCartHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = getUserFromToken(req);
  if (!user) {
    res.status(401).send(createResponse(null, "User not authenticated"));
    return;
  }

  const { productId, quantity } = req.body;

  // Validate request body
  if (!productId || !quantity || quantity <= 0) {
    res.status(400).send(createResponse(null, "Invalid productId or quantity"));
    return;
  }

  try {
    console.log("Adding to cart for User ID:", user._id);
    console.log("ProductId:", productId, "Quantity:", quantity);

    const updatedCart = await cartService.addItemToCart(user._id, productId, quantity);

    res.send(createResponse(updatedCart, "Item added to cart successfully"));
  } catch (error) {
    console.error("Error in addToCartHandler:", error); // Detailed error logging
    res.status(500).send(createResponse(null, "Error adding item to cart"));
  }
});

// Controller to remove an item from the user's cart
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

// Controller to update the quantity of an item in the user's cart
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

// Controller to view the user's cart
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

// Controller to clear all items in the user's cart
export const clearCartHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).send(createResponse(null, "User not authenticated"));
    return;
  }

  const userId = req.user._id;

  const clearedCart = await cartService.clearCart(userId);

  res.send(createResponse(clearedCart, "Cart cleared successfully"));
});
