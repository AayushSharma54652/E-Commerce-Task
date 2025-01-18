import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import { createProduct, updateProduct, validateProductFilters } from "./product.validation";
import {
  createProductHandler,
  updateProductHandler,
  getAllProductsHandler,
  getProductByIdHandler,
  deleteProductHandler,
} from "./product.controller";
import { isAdmin } from "../common/middleware/AdminCheck.middleware";

const router = Router();

router.post(
  "/",
  isAdmin,
  createProduct,
  catchError,
  createProductHandler
);

router.put(
  "/:productId",
  isAdmin,
  updateProduct,
  catchError,
  updateProductHandler
);

router.get(
  "/",
  validateProductFilters,
  catchError,
  getAllProductsHandler
);

router.get(
  "/:productId",
  getProductByIdHandler
);

router.delete(
  "/:productId",
  isAdmin,
  deleteProductHandler
);

export default router;
