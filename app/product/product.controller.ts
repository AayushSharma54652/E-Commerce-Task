import * as productService from "./product.service";
import { createResponse } from "../common/helper/response.hepler"; // Helper for standard response format
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { CreateProductDto, UpdateProductDto } from "./product.dto";
import { type FilterParams } from "./product.dto";

// Controller to create a new product
export const createProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const productDto: CreateProductDto = req.body; // Get product data from the request body
  if (req.files) {
    // If files are uploaded, handle them
    const imagePaths = (req.files as Express.Multer.File[]).map(file => file.path); // Map file paths to the images array
    productDto.images = imagePaths; // Attach the uploaded image paths to the product data
  }
  
  const product = await productService.createProduct(productDto); // Call service to create product
  res.send(createResponse(product, "Product created successfully")); // Send response with product data
});

// Controller to get all products with optional search, filter, and pagination
export const getAllProductsHandler = asyncHandler(async (req: Request, res: Response) => {
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
// Controller to get a single product by its ID
export const getProductByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.id; // Get product ID from the URL parameters
  const product = await productService.getProductById(productId); // Call service to get product by ID
  res.send(createResponse(product, "Product retrieved successfully")); // Send response with product data
});

// Controller to update a product
export const updateProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.id; // Get product ID from the URL parameters
  const updateDto: UpdateProductDto = req.body; // Get update data from the request body
  if (req.files) {
    // If files are uploaded, handle them
    const imagePaths = (req.files as Express.Multer.File[]).map(file => file.path); // Map file paths to the images array
    updateDto.images = imagePaths; // Attach the uploaded image paths to the update data
  }

  const updatedProduct = await productService.updateProduct(productId, updateDto); // Call service to update product
  res.send(createResponse(updatedProduct, "Product updated successfully")); // Send response with updated product data
});

// Controller to delete a product
export const deleteProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.id; // Get product ID from the URL parameters
  await productService.deleteProduct(productId); // Call service to delete product
  res.send(createResponse(null, "Product deleted successfully")); // Send success response
});
