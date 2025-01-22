import { BaseSchema } from "../common/dto/base.dto";

export interface ICartProduct {
  productId: string; // References the Product entity
  quantity: number; // Quantity of the product in the cart
}

export interface ICart extends BaseSchema {
  userId: string; // References the User entity
  products: ICartProduct[]; // List of products with quantity
  totalPrice: number; // Dynamically calculated based on product prices and quantities
}

export interface CreateCartDto {
  userId: string; // ID of the user owning the cart
  products: ICartProduct[]; // List of products to add to the cart
}

export interface UpdateCartDto {
  products?: ICartProduct[]; // Optionally update the products in the cart
}

export interface CartResponseDto {
  userId: string; // User owning the cart
  products: Array<{
    productId: string;
    name: string; // Product name
    price: number; // Product price
    quantity: number; // Quantity of the product in the cart
    totalProductPrice: number; // price * quantity
  }>;
  totalPrice: number; // Total cart price
}
