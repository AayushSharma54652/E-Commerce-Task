import { Request, Response } from "express";
import { createResponse } from "../common/helper/response.hepler";
import {
  addProductToCart as addToCart,
  removeProductFromCart as removeFromCart,
  updateProductQuantity as updateQuantity,
  getUserCart as getCart,
} from "./cart.service";

export const addProductToCart = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { productId, quantity } = req.body;

  try {
    const cart = await addToCart(userId, productId, quantity);
    return res.status(200).send(createResponse(cart, "Product added to cart"));
  } catch (error: any) {
    return res.status(400).send(createResponse(null, error.message));
  }
};

export const getUserCart = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const cart = await getCart(userId);
    return res.status(200).send(createResponse(cart, "Cart details fetched"));
  } catch (error: any) {
    return res.status(400).send(createResponse(null, error.message));
  }
};

export const removeProductFromCart = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { productId } = req.params;

  try {
    const cart = await removeFromCart(userId, productId);
    return res.status(200).send(createResponse(cart, "Product removed from cart"));
  } catch (error: any) {
    return res.status(400).send(createResponse(null, error.message));
  }
};

export const updateProductQuantity = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await updateQuantity(userId, productId, quantity);
    return res.status(200).send(createResponse(cart, "Cart updated successfully"));
  } catch (error: any) {
    return res.status(400).send(createResponse(null, error.message));
  }
};
