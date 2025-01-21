import ProductModel from "./product.schema";
import { CreateProductDto, UpdateProductDto } from "./product.dto";
import createHttpError from "http-errors";
import { type FilterParams } from "./product.dto";

/**
 * Creates a new product in the database.
 *
 * @async
 * @param {CreateProductDto} productDto - The DTO containing product details to create.
 * @returns {Promise<ProductModel>} - A promise resolving to the created product.
 * @throws {HttpError} - Throws a 500 error if the product cannot be created.
 */
export const createProduct = async (productDto: CreateProductDto) => {
  try {
    const product = new ProductModel({
      ...productDto,
      isActive: productDto.isActive ?? true,
    });

    await product.save();
    return product;
  } catch (error) {
    throw createHttpError(500, "Error creating product");
  }
};

/**
 * Retrieves a list of products based on the provided filter parameters.
 *
 * @async
 * @param {FilterParams} filterParams - Filters and pagination options for fetching products.
 * @returns {Promise<{ products: ProductModel[], totalProducts: number }>} - A promise resolving to the list of products and the total count.
 * @throws {HttpError} - Throws a 500 error if products cannot be fetched.
 */
export const getProducts = async (filterParams: FilterParams) => {
  const { search, category, priceRange, isActive, page = 1, limit = 10 } = filterParams;
  
  const query: any = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  if (priceRange) {
    const { min, max } = priceRange;
    if (min !== undefined) query.price = { ...query.price, $gte: min };
    if (max !== undefined) query.price = { ...query.price, $lte: max };
  }

  if (isActive !== undefined) {
    query.isActive = isActive;
  }

  const skip = (page - 1) * limit;

  try {
    const products = await ProductModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    const totalProducts = await ProductModel.countDocuments(query);

    return { products, totalProducts };
  } catch (error) {
    throw createHttpError(500, "Error fetching products");
  }
};

/**
 * Retrieves a product by its ID.
 *
 * @async
 * @param {string} productId - The ID of the product to retrieve.
 * @returns {Promise<ProductModel>} - A promise resolving to the product details.
 * @throws {HttpError} - Throws a 404 error if the product is not found or a 500 error for other issues.
 */
export const getProductById = async (productId: string) => {
  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw createHttpError(404, "Product not found");
    }
    return product;
  } catch (error) {
    throw createHttpError(500, "Error fetching product");
  }
};

/**
 * Updates a product by its ID.
 *
 * @async
 * @param {string} productId - The ID of the product to update.
 * @param {UpdateProductDto} updateDto - The DTO containing the product details to update.
 * @returns {Promise<ProductModel>} - A promise resolving to the updated product.
 * @throws {HttpError} - Throws a 404 error if the product is not found or a 500 error for other issues.
 */
export const updateProduct = async (productId: string, updateDto: UpdateProductDto) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateDto,
      { new: true }
    );

    if (!updatedProduct) {
      throw createHttpError(404, "Product not found");
    }

    return updatedProduct;
  } catch (error) {
    throw createHttpError(500, "Error updating product");
  }
};

/**
 * Deletes a product by its ID.
 *
 * @async
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<ProductModel>} - A promise resolving to the deleted product.
 * @throws {HttpError} - Throws a 404 error if the product is not found or a 500 error for other issues.
 */
export const deleteProduct = async (productId: string) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    if (!deletedProduct) {
      throw createHttpError(404, "Product not found");
    }
    return deletedProduct;
  } catch (error) {
    throw createHttpError(500, "Error deleting product");
  }
};
