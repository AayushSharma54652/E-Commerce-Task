import CartModel from "./cart.schema";
import ProductModel from "../product/product.schema";
import createHttpError from "http-errors";

interface CartItem {
  productId: string;
  quantity: number;
}

/**
 * Creates a new cart for the specified user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} The newly created cart.
 * @throws Will throw an error if cart creation fails.
 */
export const createCart = async (userId: string) => {
  try {
    const newCart = new CartModel({ userId, products: [] });
    await newCart.save();
    return newCart;
  } catch (error) {
    throw createHttpError(500, "Error creating cart");
  }
};

/**
 * Retrieves a user's cart by their user ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} The user's cart.
 * @throws Will throw an error if the cart is not found or retrieval fails.
 */
export const getCartByUserId = async (userId: string) => {
  try {
    const cart = await CartModel.findOne({ userId }).populate("products.productId");
    if (!cart) throw createHttpError(404, "Cart not found");
    return cart;
  } catch (error) {
    throw createHttpError(500, "Error fetching cart");
  }
};

/**
 * Adds an item to the user's cart.
 * @param {string} userId - The ID of the user.
 * @param {string} productId - The ID of the product to add.
 * @param {number} quantity - The quantity of the product to add.
 * @returns {Promise<object>} The updated cart.
 * @throws Will throw an error if the product or cart is not found or the operation fails.
 */
export const addItemToCart = async (userId: string, productId: string, quantity: number) => {
  try {
    const product = await ProductModel.findById(productId);
    if (!product) throw createHttpError(404, "Product not found");

    const cart = await CartModel.findOne({ userId });
    if (!cart) throw createHttpError(404, "Cart not found");

    const existingProductIndex = cart.products.findIndex(
      (item: CartItem) => item.productId.toString() === productId
    );

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    return cart;
  } catch (error) {
    throw createHttpError(500, "Error adding item to cart");
  }
};

/**
 * Removes an item from the user's cart.
 * @param {string} userId - The ID of the user.
 * @param {string} productId - The ID of the product to remove.
 * @returns {Promise<object>} The updated cart.
 * @throws Will throw an error if the cart is not found or the operation fails.
 */
export const removeItemFromCart = async (userId: string, productId: string) => {
  try {
    const cart = await CartModel.findOne({ userId });
    if (!cart) throw createHttpError(404, "Cart not found");

    cart.products = cart.products.filter((item: CartItem) => item.productId.toString() !== productId);
    await cart.save();
    return cart;
  } catch (error) {
    throw createHttpError(500, "Error removing item from cart");
  }
};

/**
 * Updates the quantity of a product in the user's cart.
 * @param {string} userId - The ID of the user.
 * @param {string} productId - The ID of the product to update.
 * @param {number} quantity - The new quantity of the product.
 * @returns {Promise<object>} The updated cart.
 * @throws Will throw an error if the product is not found in the cart or the operation fails.
 */
export const updateItemQuantity = async (userId: string, productId: string, quantity: number) => {
  try {
    const cart = await CartModel.findOne({ userId });
    if (!cart) throw createHttpError(404, "Cart not found");

    const productIndex = cart.products.findIndex(
      (item: CartItem) => item.productId.toString() === productId
    );

    if (productIndex === -1) throw createHttpError(404, "Product not found in cart");

    if (quantity <= 0) {
      cart.products.splice(productIndex, 1);
    } else {
      cart.products[productIndex].quantity = quantity;
    }

    await cart.save();
    return cart;
  } catch (error) {
    throw createHttpError(500, "Error updating item quantity in cart");
  }
};

/**
 * Clears all items from the user's cart.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} The updated cart with no items.
 * @throws Will throw an error if the cart is not found or the operation fails.
 */
export const clearCart = async (userId: string) => {
  try {
    const cart = await CartModel.findOne({ userId });
    if (!cart) throw createHttpError(404, "Cart not found");

    cart.products = [];
    await cart.save();
    return cart;
  } catch (error) {
    throw createHttpError(500, "Error clearing cart");
  }
};
