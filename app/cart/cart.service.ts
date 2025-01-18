import CartModel from "./cart.schema"; // Import the Cart model
import ProductModel from "../product/product.schema"; // Import Product model to validate product IDs
import createHttpError from "http-errors"; // For custom error handling

// Define the type for cart items
interface CartItem {
  productId: string; // productId should be a string (could also be ObjectId)
  quantity: number;
}

// Service to create a new cart for the user
export const createCart = async (userId: string) => {
  try {
    const newCart = new CartModel({
      userId,
      products: [],
    });

    await newCart.save(); // Save the cart in the database
    return newCart; // Return the created cart
  } catch (error) {
    throw createHttpError(500, "Error creating cart");
  }
};

// Service to get a user's cart by user ID
export const getCartByUserId = async (userId: string) => {
  try {
    const cart = await CartModel.findOne({ userId }).populate("products.productId"); // Populate product details
    if (!cart) {
      throw createHttpError(404, "Cart not found");
    }
    return cart; // Return the user's cart
  } catch (error) {
    throw createHttpError(500, "Error fetching cart");
  }
};

// Service to add an item to the user's cart
export const addItemToCart = async (userId: string, productId: string, quantity: number) => {
  try {
    // Validate if the product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw createHttpError(404, "Product not found");
    }

    // Find the cart for the user
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      throw createHttpError(404, "Cart not found");
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.products.findIndex((item: CartItem) => item.productId.toString() === productId);

    if (existingProductIndex > -1) {
      // Product already in cart, update quantity
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Product not in cart, add to cart
      cart.products.push({
        productId,
        quantity,
      });
    }

    // Save the updated cart
    await cart.save();
    return cart; // Return the updated cart
  } catch (error) {
    throw createHttpError(500, "Error adding item to cart");
  }
};

// Service to remove an item from the user's cart
export const removeItemFromCart = async (userId: string, productId: string) => {
  try {
    // Find the cart for the user
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      throw createHttpError(404, "Cart not found");
    }

    // Remove the product from the cart
    cart.products = cart.products.filter((item: CartItem) => item.productId.toString() !== productId);

    // Save the updated cart
    await cart.save();
    return cart; // Return the updated cart
  } catch (error) {
    throw createHttpError(500, "Error removing item from cart");
  }
};

// Service to update the quantity of an item in the user's cart
export const updateItemQuantity = async (userId: string, productId: string, quantity: number) => {
  try {
    // Find the cart for the user
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      throw createHttpError(404, "Cart not found");
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex((item: CartItem) => item.productId.toString() === productId);

    if (productIndex === -1) {
      throw createHttpError(404, "Product not found in cart");
    }

    // Update the quantity
    if (quantity <= 0) {
      // If quantity is less than or equal to zero, remove the item from the cart
      cart.products.splice(productIndex, 1);
    } else {
      // Otherwise, update the quantity
      cart.products[productIndex].quantity = quantity;
    }

    // Save the updated cart
    await cart.save();
    return cart; // Return the updated cart
  } catch (error) {
    throw createHttpError(500, "Error updating item quantity in cart");
  }
};

// Service to clear all items in the user's cart
export const clearCart = async (userId: string) => {
  try {
    // Find the cart for the user
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      throw createHttpError(404, "Cart not found");
    }

    // Clear all items from the cart
    cart.products = [];

    // Save the updated cart
    await cart.save();
    return cart; // Return the cleared cart
  } catch (error) {
    throw createHttpError(500, "Error clearing cart");
  }
};
