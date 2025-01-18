// cart.dto.ts

// DTO for adding an item to the cart
export interface AddToCartDto {
    userId: string; // ID of the user who is adding the product to the cart (critical for identifying the user's cart)
    productId: string; // ID of the product being added to the cart
    quantity: number; // Quantity of the product being added
  }
  
  // DTO for updating the quantity of an item in the cart
  export interface UpdateCartItemDto {
    userId: string; // User ID whose cart is being updated
    productId: string; // Product ID to update in the cart
    quantity: number; // Updated quantity for the product
  }
  
  // DTO for removing an item from the cart
  export interface RemoveFromCartDto {
    userId: string; // User ID whose cart is being updated
    productId: string; // Product ID to remove from the cart
  }
  
  // DTO for cart response, to show details of the cart along with items and total price
  export interface CartResponseDto {
    _id: string; // Cart ID, useful for referencing the cart in future operations
    userId: string; // User ID (who owns the cart)
    items: CartItemDto[]; // Array of cart items (each item has its own product and quantity)
    totalPrice: number; // Total price of the cart (sum of all items' prices, calculated dynamically)
  }
  
  // DTO for individual cart items, representing each product in the cart
  export interface CartItemDto {
    productId: string; // Product ID (to identify which product it is)
    quantity: number; // Quantity of the product in the cart
    productName: string; // Product name (retrieved from the Product model)
    productPrice: number; // Price of a single product (retrieved from the Product model)
    totalItemPrice: number; // Total price for this item (quantity * product price)
  }
  