import mongoose, { Schema, Document } from "mongoose";
import { IOrder, OrderStatus, IOrderItem } from "./order.dto"; // Import DTO and Enum

// Schema for individual order items (products in the order)
const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to the Product model
    quantity: { type: Number, required: true, min: 1 }, // Quantity of the product ordered
    price: { type: Number, required: true }, // Price of the product at the time of order
  },
  { _id: false } // Prevent adding _id to individual items
);

// Define the IOrderDocument interface extending the mongoose Document type
export interface IOrderDocument extends Document {
  user: mongoose.Schema.Types.ObjectId; // Reference to the User model
  items: IOrderItem[]; // Array of items in the order
  totalAmount: number; // Total amount for the order
  status: OrderStatus; // Status of the order (e.g., Pending, Shipped, Delivered)
  shippingAddress: string; // Shipping address
  deliveryDate?: Date; // Estimated or actual delivery date
  createdAt: Date; // Order creation timestamp
  updatedAt: Date; // Order update timestamp
}

// Schema for the order
const orderSchema = new Schema<IOrderDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
    items: { type: [orderItemSchema], required: true }, // Array of products in the order
    totalAmount: { type: Number, required: true }, // Total price of the order
    status: {
      type: String,
      enum: Object.values(OrderStatus), // Enum for order status
      default: OrderStatus.PENDING, // Default status when an order is created
    },
    shippingAddress: { type: String, required: true }, // Shipping address for the order
    createdAt: { type: Date, default: Date.now }, // Timestamp of order creation
    updatedAt: { type: Date, default: Date.now }, // Timestamp for last update
    deliveryDate: { type: Date }, // Estimated or actual delivery date
  },
  { timestamps: true } // Automatically handle createdAt and updatedAt
);

// Create the Mongoose model for Order
const OrderModel = mongoose.model<IOrderDocument>("Order", orderSchema);

export default OrderModel;
