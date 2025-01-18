import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware"; // Validation error handler
import { createProduct, updateProduct, validateProductFilters } from "./product.validation"; // Validation logic
import {
  createProductHandler,
  updateProductHandler,
  getAllProductsHandler,
  getProductByIdHandler,
  deleteProductHandler,
} from "./product.controller"; // Controller methods
import { isAdmin } from "../common/middleware/AdminCheck.middleware";

const  router = Router();

// Route for creating a product
router.post(
  "/",
  isAdmin,
  createProduct, // Validation middleware
  catchError, // Catch any validation errors
  createProductHandler // Controller for creating the product
);

// Route for updating a product
router.put(
  "/:productId",
  isAdmin,
  updateProduct, // Validation middleware
  catchError, // Catch any validation errors
  updateProductHandler // Controller for updating the product
);

// Route for getting all products (with optional pagination and filtering)
router.get(
    "/",
    validateProductFilters, // Validation middleware for query parameters
    catchError, // Catch any validation errors
    getAllProductsHandler // Controller for fetching all products
  );
  

// Route for getting a product by its ID
router.get(
  "/:productId",
  getProductByIdHandler // Controller for fetching a specific product
);

// Route for deleting a product
router.delete(
  "/:productId",
  isAdmin,
  deleteProductHandler // Controller for deleting the product
);

export default router;
