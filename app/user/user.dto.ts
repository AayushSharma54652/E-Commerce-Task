import { type BaseSchema } from "../common/dto/base.dto";

// User interface for database model
export interface IUser extends BaseSchema {
  name: string;
  email: string;
  password: string; // This will be hashed
  refreshToken?: string; // Store refresh token for the user
  role: "CUSTOMER" | "ADMIN";
  active?: boolean;  // Indicates if the user account is active
  createdAt?: Date;  // Managed by Mongoose automatically
  updatedAt?: Date;  // Managed by Mongoose automatically
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string; // Password will be hashed before saving
  role: "CUSTOMER" | "ADMIN";
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string; // Password will be hashed before updating
  active?: boolean;
  role?: "CUSTOMER" | "ADMIN";
}

export interface LoginUserDto {
  email: string;
  password: string; // Plaintext password for comparison
}
