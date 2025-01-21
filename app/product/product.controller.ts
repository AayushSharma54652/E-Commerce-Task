import * as productService from "./product.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { CreateProductDto, UpdateProductDto } from "./product.dto";
import { type FilterParams } from "./product.dto";

/**
 * Handles the creation of a new product.
 * If images are uploaded, their paths are added to the product DTO.
 * 
 * @async
 * @param {Request} req - The Express request object, containing product details and optionally image files.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} - A promise resolving to the created product details.
 */
export const createProductHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const productDto: CreateProductDto = req.body;
  
  if (req.files) {
    const imagePaths = (req.files as Express.Multer.File[]).map(file => file.path);
    productDto.images = imagePaths;
  }

  const product = await productService.createProduct(productDto);
  res.send(createResponse(product, "Product created successfully"));
});

/**
 * Handles retrieval of all products with optional filters like search, category, price range, and pagination.
 * 
 * @async
 * @param {Request} req - The Express request object, containing query parameters for filtering and pagination.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} - A promise resolving to a paginated list of products.
 */
export const getAllProductsHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const {
    search,
    category,
    priceMin,
    priceMax,
    isActive,
    page = 1,
    limit = 10,
  } = req.query;

  const filterParams: FilterParams = {
    search: search as string,
    category: category as string,
    priceRange: {
      min: priceMin ? Number(priceMin) : undefined,
      max: priceMax ? Number(priceMax) : undefined,
    },
    isActive: isActive !== undefined ? isActive === "true" : undefined,
    page: Number(page),
    limit: Number(limit),
  };

  const { products, totalProducts } = await productService.getProducts(filterParams);

  res.send(
    createResponse(
      {
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / filterParams.limit),
        currentPage: filterParams.page,
      },
      "Products retrieved successfully"
    )
  );
});

/**
 * Handles retrieval of a product by its ID.
 * 
 * @async
 * @param {Request} req - The Express request object, containing the product ID in the route parameters.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} - A promise resolving to the product details.
 */
export const getProductByIdHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const productId = req.params.id;
  const product = await productService.getProductById(productId);
  res.send(createResponse(product, "Product retrieved successfully"));
});

/**
 * Handles updating of an existing product.
 * If new images are uploaded, their paths are added to the update DTO.
 * 
 * @async
 * @param {Request} req - The Express request object, containing the product ID in route parameters and update data in the body.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} - A promise resolving to the updated product details.
 */
export const updateProductHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const productId = req.params.id;
  const updateDto: UpdateProductDto = req.body;

  if (req.files) {
    const imagePaths = (req.files as Express.Multer.File[]).map(file => file.path);
    updateDto.images = imagePaths;
  }

  const updatedProduct = await productService.updateProduct(productId, updateDto);
  res.send(createResponse(updatedProduct, "Product updated successfully"));
});

/**
 * Handles deletion of a product by its ID.
 * 
 * @async
 * @param {Request} req - The Express request object, containing the product ID in route parameters.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} - A promise resolving to a success message.
 */
export const deleteProductHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const productId = req.params.id;
  await productService.deleteProduct(productId);
  res.send(createResponse(null, "Product deleted successfully"));
});
