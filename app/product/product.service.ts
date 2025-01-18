import ProductModel from "./product.schema"; // Import the product model
import { CreateProductDto, UpdateProductDto } from "./product.dto"; // Import the DTOs
import createHttpError from "http-errors"; // For custom error handling
import { type FilterParams } from "./product.dto"; 


// Service to create a new product
export const createProduct = async (productDto: CreateProductDto) => {
  try {
    // Create a new product instance with the provided DTO
    const product = new ProductModel({
      ...productDto,
      isActive: productDto.isActive ?? true, // Default to active if not provided
    });

    await product.save(); // Save the product in the database
    return product; // Return the created product
  } catch (error) {
    throw createHttpError(500, "Error creating product");
  }
};

// Service to get all products with optional search, filter, and pagination
export const getProducts = async (filterParams: FilterParams) => {
    const { search, category, priceRange, isActive, page = 1, limit = 10 } = filterParams;
  
    // Build the query object
    const query: any = {};
  
    // If search parameter is provided, apply a case-insensitive search on name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
  
    // If category is provided, filter by category
    if (category) {
      query.category = category;
    }
  
    // If priceRange is provided, filter by price range
    if (priceRange) {
      const { min, max } = priceRange;
      if (min !== undefined) query.price = { ...query.price, $gte: min }; // min price filter
      if (max !== undefined) query.price = { ...query.price, $lte: max }; // max price filter
    }
  
    // If isActive is defined, filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive;
    }
  
    // Pagination
    const skip = (page - 1) * limit;
  
    try {
      // Fetch products with filtering, pagination, and sorting
      const products = await ProductModel.find(query) // Use ProductModel here
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 }); // You can modify this sorting logic as needed
  
      // Get the total number of products matching the query
      const totalProducts = await ProductModel.countDocuments(query); // Use ProductModel here
  
      return { products, totalProducts };
    } catch (error) {
      throw createHttpError(500, "Error fetching products");
    }
  };

// Service to get a single product by its ID
export const getProductById = async (productId: string) => {
  try {
    const product = await ProductModel.findById(productId); // Find the product by ID
    if (!product) {
      throw createHttpError(404, "Product not found"); // If no product found, throw error
    }
    return product; // Return the product
  } catch (error) {
    throw createHttpError(500, "Error fetching product");
  }
};

// Service to update a product by its ID
export const updateProduct = async (
  productId: string,
  updateDto: UpdateProductDto
) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateDto,
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      throw createHttpError(404, "Product not found"); // If product is not found, throw error
    }

    return updatedProduct; // Return the updated product
  } catch (error) {
    throw createHttpError(500, "Error updating product");
  }
};

// Service to delete a product by its ID
export const deleteProduct = async (productId: string) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(productId); // Delete product by ID
    if (!deletedProduct) {
      throw createHttpError(404, "Product not found"); // If product is not found, throw error
    }
    return deletedProduct; // Return the deleted product
  } catch (error) {
    throw createHttpError(500, "Error deleting product");
  }
};
