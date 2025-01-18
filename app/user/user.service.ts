import { IUser, CreateUserDto, LoginUserDto, UpdateUserDto } from "./user.dto";
import UserModel from "./user.schema";
import bcrypt from "bcryptjs";
import { generateTokens } from "../common/helper/token.helper";
import createHttpError from "http-errors";

export const createUser = async (userDto: CreateUserDto): Promise<IUser> => {
  const { name, email, password, role } = userDto;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
    role,
  });

  await newUser.save();
  return newUser;
};

export const loginUser = async (loginDto: LoginUserDto) => {
  const { email, password } = loginDto;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, "Invalid credentials");
  }

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

export const updateUser = async (userId: string, updateDto: UpdateUserDto): Promise<IUser> => {
  const updatedUser = await UserModel.findByIdAndUpdate(userId, updateDto, { new: true });

  if (!updatedUser) {
    throw createHttpError(404, "User not found");
  }

  return updatedUser;
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return user;
};

export const logoutUser = async (refreshToken: string): Promise<void> => {
  await UserModel.findOneAndUpdate({ refreshToken }, { refreshToken: null });
};
