export interface AddToCartDto {
  userId: string;
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  userId: string;
  productId: string;
  quantity: number;
}

export interface RemoveFromCartDto {
  userId: string;
  productId: string;
}

export interface CartResponseDto {
  _id: string;
  userId: string;
  items: CartItemDto[];
  totalPrice: number;
}

export interface CartItemDto {
  productId: string;
  quantity: number;
  productName: string;
  productPrice: number;
  totalItemPrice: number;
}
