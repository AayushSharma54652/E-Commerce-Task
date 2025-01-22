import { BaseSchema } from "../common/dto/base.dto";

export interface IProduct extends BaseSchema {
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string[];
  isActive?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stockQuantity?: number;
  images?: string[];
  isActive?: boolean;
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
