import { ObjectId } from "mongoose";
import { IUser } from "../user/user.dto";
import { IProduct } from "../product/product.dto";


export enum OrderStatus {
  PENDING = "Pending",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
}


export interface IOrderItem {
  productId: IProduct;
  quantity: number;
  price: number;
}


export interface IOrder {
  user: IUser;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
  deliveryDate?: Date;
}


export interface IOrderDocument extends IOrder {
  _id: ObjectId;
  __v: number;
}
