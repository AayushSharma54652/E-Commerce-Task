import { type BaseSchema } from "../common/dto/base.dto";

export interface IUser extends BaseSchema {
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
  role: "CUSTOMER" | "ADMIN";
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  active?: boolean;
  role?: "CUSTOMER" | "ADMIN";
}

export interface LoginUserDto {
  email: string;
  password: string;
}
