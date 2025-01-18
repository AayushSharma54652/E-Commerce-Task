import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "./product.dto"; // Importing the IProduct interface from product.dto.ts

const productSchema: Schema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Ensuring the price is not negative
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0, // Ensuring stock quantity cannot be negative
    },
    images: {
      type: [String], // Array of image URLs or file paths
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, // Default to true if not specified
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Create and export the product model
const ProductModel = mongoose.model<IProduct & Document>("Product", productSchema);

export default ProductModel;
