import ProductModel from "./product.schema";
import { CreateProductDto, UpdateProductDto } from "./product.dto";
import createHttpError from "http-errors";
import { type FilterParams } from "./product.dto"; 

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

export const updateProduct = async (
  productId: string,
  updateDto: UpdateProductDto
) => {
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
