import { ObjectId } from "mongoose"; // Assuming you're using MongoDB with Mongoose
import { IUser } from "../user/user.dto"; // Assuming you have a user DTO
import { IProduct } from "../product/product.dto"; // Assuming you have a product DTO

// Enum for possible order statuses
export enum OrderStatus {
  PENDING = "Pending",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
}

// DTO for Order item
export interface IOrderItem {
  productId: IProduct;  // Product being ordered
  quantity: number;     // Quantity of the product
  price: number;        // Price of the product at the time of order
}

// DTO for Order details
export interface IOrder {
  user: IUser;                 // User who placed the order
  items: IOrderItem[];         // List of products in the order
  totalAmount: number;         // Total price of all products in the order
  status: OrderStatus;         // Current status of the order
  shippingAddress: string;     // Address to ship the order
  createdAt: Date;             // When the order was placed
  updatedAt: Date;             // Last updated timestamp (for status updates)
  deliveryDate?: Date;         // Estimated or actual delivery date
}

// Order schema for database (if you're using Mongoose)
export interface IOrderDocument extends IOrder {
  _id: ObjectId;               // MongoDB ID
  __v: number;                 // Mongoose versioning
}
