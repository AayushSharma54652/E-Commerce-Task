import mongoose, { Document, Schema } from "mongoose";
import { CartItemDto } from "./cart.dto";

const CartItemSchema: Schema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
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
  { _id: false }
);

const CartSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

interface CartItem {
  productId: string;
  quantity: number;
  productName: string;
  productPrice: number;
  totalItemPrice: number;
}

CartSchema.methods.calculateTotalPrice = function () {
  const totalPrice = this.items.reduce((total: number, item: CartItem) => total + item.totalItemPrice, 0);
  this.totalPrice = totalPrice;
  return totalPrice;
};

const CartModel = mongoose.model("Cart", CartSchema);

export default CartModel;
