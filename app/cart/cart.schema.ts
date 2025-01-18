import mongoose, { Document, Schema } from "mongoose";
import { CartItemDto } from "./cart.dto"; // Ensure this DTO file is properly imported

// Define the CartItem schema to represent each product in the cart
const CartItemSchema: Schema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product", // Referencing the Product model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Ensure the quantity is at least 1
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    totalItemPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false } // Prevent creation of an _id for cart items
);

// Define the Cart schema to represent a user's cart
const CartSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Referencing the User model
      required: true,
      unique: true, // Ensure each user can only have one active cart
    },
    items: {
      type: [CartItemSchema], // Array of CartItems
      default: [],
    },
    totalPrice: {
      type: Number,
      default: 0, // Total price will be calculated dynamically
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Define the type for CartItem
interface CartItem {
  productId: string; // productId should be a string (could also be ObjectId)
  quantity: number;
  productName: string;
  productPrice: number;
  totalItemPrice: number;
}

// Method to calculate total price dynamically
CartSchema.methods.calculateTotalPrice = function () {
  const totalPrice = this.items.reduce((total: number, item: CartItem) => {
    return total + item.totalItemPrice; // Sum up the total price of each item in the cart
  }, 0);

  this.totalPrice = totalPrice; // Set the total price for the cart
  return totalPrice;
};

// Cart model based on the Cart schema
const CartModel = mongoose.model("Cart", CartSchema);

export default CartModel;
