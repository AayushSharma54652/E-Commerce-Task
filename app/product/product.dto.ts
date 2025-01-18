import { type BaseSchema } from "../common/dto/base.dto";

// Interface for the Product schema
export interface IProduct extends BaseSchema {
  name: string;
  description: string;
  price: number;
  category: string; // The category can be stored as the category name or as a reference to the Category model
  stockQuantity: number;
  images: string[]; // Array of image URLs or paths (e.g., from cloud storage or local storage)
  isActive?: boolean; // Indicates whether the product is active or not (e.g., if it's available for sale)
  createdAt?: Date;
  updatedAt?: Date;
}

// DTO for creating a new product
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string[]; // Array of image URLs or paths
  isActive?: boolean; // Optional: You may want to default to 'true' if not provided
}

// DTO for updating an existing product
export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stockQuantity?: number;
  images?: string[]; // Optional: To update product images
  isActive?: boolean; // Optional: To update product status (active or inactive)
}


export type FilterParams = {
    search?: string;
    category?: string;
    priceRange?: {
      min?: number;
      max?: number;
    };
    isActive?: boolean;
    page: number;
    limit: number;
};