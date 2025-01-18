import { IUser, CreateUserDto, LoginUserDto, UpdateUserDto } from "./user.dto";
import UserModel from "./user.schema";
import bcrypt from "bcryptjs";
import { generateTokens } from "../common/helper/token.helper"; // Import token helper for generating tokens
import createHttpError from "http-errors";

// Register a new user
export const createUser = async (userDto: CreateUserDto): Promise<IUser> => {
  const { name, email, password, role } = userDto;

  // Check if the user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, "User already exists");
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
    role,
  });

  await newUser.save();
  return newUser; // Return the created user
};

// Login a user
export const loginUser = async (loginDto: LoginUserDto) => {
  const { email, password } = loginDto;

  // Find the user by email
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }

  // Check if the provided password matches the stored password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, "Invalid credentials");
  }

  // Generate access and refresh tokens after successful login
  const { accessToken, refreshToken } = generateTokens({
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    user,
    tokens: { accessToken, refreshToken },
  };
};

// Update user details
export const updateUser = async (userId: string, updateDto: UpdateUserDto): Promise<IUser> => {
  const updatedUser = await UserModel.findByIdAndUpdate(userId, updateDto, { new: true });

  if (!updatedUser) {
    throw createHttpError(404, "User not found");
  }

  return updatedUser; // Return the updated user
};

// Get user details by ID
export const getUserById = async (userId: string): Promise<IUser | null> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return user;
};

export const logoutUser = async (refreshToken: string): Promise<void> => {
  // Remove the refresh token from the user's document
  await UserModel.findOneAndUpdate({ refreshToken }, { refreshToken: null });
};
