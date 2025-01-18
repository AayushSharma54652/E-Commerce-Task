import { body, query } from "express-validator";

export const createProduct = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isString()
    .withMessage("Product description must be a string"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isString()
    .withMessage("Category must be a string"),
  body("stockQuantity")
    .notEmpty()
    .withMessage("Stock quantity is required")
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a non-negative integer"),
  body("images")
    .notEmpty()
    .withMessage("Product images are required")
    .isArray()
    .withMessage("Images must be an array")
    .custom((value) => value.every((url: string) => typeof url === "string"))
    .withMessage("Each image must be a string URL"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export const updateProduct = [
  body("name")
    .optional()
    .isString()
    .withMessage("Product name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Product description must be a string"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
  body("stockQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a non-negative integer"),
  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array")
    .custom((value) => value.every((url: string) => typeof url === "string"))
    .withMessage("Each image must be a string URL"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export const validateProductFilters = [
  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string"),
  query("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
  query("priceMin")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("PriceMin must be a positive number"),
  query("priceMax")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("PriceMax must be a positive number"),
  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("IsActive must be a boolean")
    .toBoolean(),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer")
    .toInt(),
];
