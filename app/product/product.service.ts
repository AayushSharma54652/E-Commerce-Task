import { Product } from "./product.entity";
import { CreateProductDto, UpdateProductDto } from "./product.dto";
import { FilterParams } from "./product.dto";
import createHttpError from "http-errors";

/**
 * Creates a new product in the database.
 *
 * @async
 * @param {CreateProductDto} productDto - The DTO containing product details to create.
 * @returns {Promise<Product>} - A promise resolving to the created product.
 * @throws {HttpError} - Throws a 500 error if the product cannot be created.
 */
export const createProduct = async (productDto: CreateProductDto): Promise<Product> => {
  try {
    const product = Product.create({
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
 * @returns {Promise<{ products: Product[], totalProducts: number }>} - A promise resolving to the list of products and the total count.
 * @throws {HttpError} - Throws a 500 error if products cannot be fetched.
 */
export const getProducts = async (filterParams: FilterParams) => {
  const { search, category, priceRange, isActive, page = 1, limit = 10 } = filterParams;

  const queryBuilder = Product.createQueryBuilder("product");

  if (search) {
    queryBuilder.andWhere("product.name ILIKE :search", { search: `%${search}%` });
  }

  if (category) {
    queryBuilder.andWhere("product.category = :category", { category });
  }

  if (priceRange) {
    const { min, max } = priceRange;
    if (min !== undefined) queryBuilder.andWhere("product.price >= :min", { min });
    if (max !== undefined) queryBuilder.andWhere("product.price <= :max", { max });
  }

  if (isActive !== undefined) {
    queryBuilder.andWhere("product.isActive = :isActive", { isActive });
  }

  // Pagination and sorting
  queryBuilder.skip((page - 1) * limit).take(limit).orderBy("product.name", "ASC");

  try {
    const [products, totalProducts] = await queryBuilder.getManyAndCount();

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
 * @returns {Promise<Product>} - A promise resolving to the product details.
 * @throws {HttpError} - Throws a 404 error if the product is not found or a 500 error for other issues.
 */
export const getProductById = async (productId: string): Promise<Product> => {
  try {
    const product = await Product.findOne({ where: { id: productId } });
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
 * @returns {Promise<Product>} - A promise resolving to the updated product.
 * @throws {HttpError} - Throws a 404 error if the product is not found or a 500 error for other issues.
 */
export const updateProduct = async (productId: string, updateDto: UpdateProductDto): Promise<Product> => {
  try {
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      throw createHttpError(404, "Product not found");
    }

    // Updating the product properties
    Object.assign(product, updateDto);
    
    await product.save();
    return product;
  } catch (error) {
    throw createHttpError(500, "Error updating product");
  }
};

/**
 * Deletes a product by its ID.
 *
 * @async
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<Product>} - A promise resolving to the deleted product.
 * @throws {HttpError} - Throws a 404 error if the product is not found or a 500 error for other issues.
 */
export const deleteProduct = async (productId: string): Promise<Product> => {
  try {
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      throw createHttpError(404, "Product not found");
    }

    await product.remove();
    return product;
  } catch (error) {
    throw createHttpError(500, "Error deleting product");
  }
};
