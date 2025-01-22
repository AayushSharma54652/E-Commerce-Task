import { body, param } from "express-validator";

// Validation for adding a product to the cart
export const addToCartValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isUUID()
    .withMessage("Invalid Product ID format"), // Use `isUUID` for TypeORM IDs
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

// Validation for updating the quantity of a cart item
export const updateCartItemValidation = [
  param("cartItemId")
    .notEmpty()
    .withMessage("Cart item ID is required")
    .isUUID()
    .withMessage("Invalid Cart item ID format. It should be a UUID."),
  
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

// Validation for removing a product from the cart
export const removeFromCartValidation = [
  param("cartItemId")
    .notEmpty()
    .withMessage("Cart item ID is required")
    .isUUID()
    .withMessage("Invalid Cart item ID format. It should be a UUID."),
];

// Validation for getting the user's cart
export const getCartValidation = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isUUID()
    .withMessage("Invalid User ID format. It should be a UUID."),
];
