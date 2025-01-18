import * as productService from "./product.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { CreateProductDto, UpdateProductDto } from "./product.dto";
import { type FilterParams } from "./product.dto";

export const createProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const productDto: CreateProductDto = req.body;
  if (req.files) {
    const imagePaths = (req.files as Express.Multer.File[]).map(file => file.path);
    productDto.images = imagePaths;
  }

  const product = await productService.createProduct(productDto);
  res.send(createResponse(product, "Product created successfully"));
});

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

export const getProductByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.id;
  const product = await productService.getProductById(productId);
  res.send(createResponse(product, "Product retrieved successfully"));
});

export const updateProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.id;
  const updateDto: UpdateProductDto = req.body;
  if (req.files) {
    const imagePaths = (req.files as Express.Multer.File[]).map(file => file.path);
    updateDto.images = imagePaths;
  }

  const updatedProduct = await productService.updateProduct(productId, updateDto);
  res.send(createResponse(updatedProduct, "Product updated successfully"));
});

export const deleteProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.id;
  await productService.deleteProduct(productId);
  res.send(createResponse(null, "Product deleted successfully"));
});
