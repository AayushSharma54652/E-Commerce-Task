import { body, param } from "express-validator";

// Validation for adding an item to the cart
export const addToCartValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID format"),
  
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

// Validation for updating an item in the cart
export const updateCartItemValidation = [
  param("cartItemId")
    .notEmpty()
    .withMessage("Cart item ID is required")
    .isMongoId()
    .withMessage("Invalid Cart item ID format"),
  
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

// Validation for removing an item from the cart
export const removeFromCartValidation = [
  param("cartItemId")
    .notEmpty()
    .withMessage("Cart item ID is required")
    .isMongoId()
    .withMessage("Invalid Cart item ID format"),
];

// Validation for getting the cart by userId (e.g., to view cart)
export const getCartValidation = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID format"),
];
