import { Cart } from "./cart.entity";
import { CartItem } from "./cart-item.entity";
import { Product } from "../product/product.entity";

export const addProductToCart = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const userCart = await Cart.findOne({
    where: { user: { id: userId }, isActive: true },
    relations: ["items", "items.product"],
  });

  let cart = userCart;
  if (!cart) {
    cart = await Cart.create({
      user: { id: userId },
      isActive: true,
    }).save();
  }

  const product = await Product.findOne({ where: { id: productId } });
  if (!product) {
    throw new Error("Product not found");
  }

  let cartItem = cart.items?.find((item) => item.product.id === productId);

  if (cartItem) {
    cartItem.quantity += quantity;
    cartItem.totalPrice = cartItem.quantity * product.price;
    await cartItem.save();
  } else {
    cartItem = await CartItem.create({
      cart,
      product,
      quantity,
      totalPrice: product.price * quantity,
    }).save();
    
    cart.items = cart.items || [];
    cart.items.push(cartItem);
  }

  cart.totalPrice = (cart.items || []).reduce(
    (total, item) => total + Number(item.totalPrice),
    0
  );
  await cart.save();

  return cart;
};
/**
 * Fetches the user's cart details, including all products and final prices.
 * @param userId The ID of the user
 * @returns The cart with all products and prices or an error message
 */
export const getUserCart = async (userId: string) => {
  try {
    const cart = await Cart.findOne({
      where: { user: { id: userId }, isActive: true },
      relations: ["items", "items.product"],
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching cart details");
  }
};

/**
 * Removes a product from the user's cart.
 * @param userId The ID of the user
 * @param productId The ID of the product to be removed from the cart
 * @returns The updated cart or an error message
 */
export const removeProductFromCart = async (userId: string, productId: string) => {
  try {
    const cart = await Cart.findOne({
      where: { user: { id: userId }, isActive: true },
      relations: ["items", "items.product"],
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const cartItem = cart.items.find((item) => item.product.id === productId);
    if (!cartItem) {
      throw new Error("Product not in cart");
    }

    await cartItem.remove();

    // Update the cart's total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
    await cart.save();

    return cart;
  } catch (error) {
    console.error(error);
    throw new Error("Error removing product from cart");
  }
};

/**
 * Updates the quantity of a product in the user's cart.
 * @param userId The ID of the user
 * @param productId The ID of the product whose quantity is to be updated
 * @param quantity The new quantity of the product
 * @returns The updated cart or an error message
 */
export const updateProductQuantity = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  try {
    const cart = await Cart.findOne({
      where: { user: { id: userId }, isActive: true },
      relations: ["items", "items.product"],
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const cartItem = cart.items.find((item) => item.product.id === productId);
    if (!cartItem) {
      throw new Error("Product not in cart");
    }

    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      throw new Error("Product not found");
    }

    // Update the quantity and total price
    cartItem.quantity = quantity;
    cartItem.totalPrice = quantity * product.price;
    await cartItem.save();

    // Update the cart's total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
    await cart.save();

    return cart;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating cart");
  }
};
