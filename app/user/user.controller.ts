import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as userService from "./user.service";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "./user.dto";
import { createResponse } from "../common/helper/response.hepler";
import { generateTokens } from "../common/helper/token.helper";

/**
 * Registers a new user.
 * @param {Request} req - The HTTP request object containing user data.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} Sends a response with the newly created user and access token.
 */
export const registerUserHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role }: CreateUserDto = req.body;
    const newUser = await userService.createUser({ name, email, password, role });

    const { accessToken, refreshToken } = generateTokens({
      id: newUser.id,  // Adjusted to use the UUID from PostgreSQL
      email: newUser.email,
      role: newUser.role,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(201).send(
      createResponse(
        {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
          accessToken,
        },
        "User registered successfully"
      )
    );
  }
);

/**
 * Logs in an existing user.
 * @param {Request} req - The HTTP request object containing login credentials.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} Sends a response with the user details and access token.
 */
export const loginUserHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password }: LoginUserDto = req.body;
    const { user, tokens } = await userService.loginUser({ email, password });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.send(
      createResponse(
        {
          user: {
            id: user.id,  // Adjusted to use the UUID from PostgreSQL
            name: user.name,
            email: user.email,
            role: user.role,
          },
          accessToken: tokens.accessToken,
        },
        "User logged in successfully"
      )
    );
  }
);

/**
 * Logs out the current user.
 * @param {Request} req - The HTTP request object containing the refresh token.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} Sends a response indicating successful logout.
 */
export const logoutUserHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(400).send(createResponse(null, "No refresh token provided"));
      return;
    }

    await userService.logoutUser(refreshToken);

    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
    res.status(200).send(createResponse(null, "User logged out successfully"));
  }
);

/**
 * Retrieves the profile of the currently authenticated user.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} Sends a response with the user's profile data.
 */
export const getUserProfileHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).send(createResponse(null, "User not authenticated"));
      return;
    }

    const userId = req.user.id;  // Adjusted to use the UUID from PostgreSQL
    const user = await userService.getUserById(userId);

    res.send(createResponse(user, "User profile retrieved successfully"));
  }
);

/**
 * Updates the profile of the currently authenticated user.
 * @param {Request} req - The HTTP request object containing updated user data.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} Sends a response with the updated user profile data.
 */
export const updateUserProfileHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).send(createResponse(null, "User not authenticated"));
      return;
    }

    const userId = req.user.id;  // Adjusted to use the UUID from PostgreSQL
    const updateData: UpdateUserDto = req.body;

    const updatedUser = await userService.updateUser(userId, updateData);

    res.send(createResponse(updatedUser, "User profile updated successfully"));
  }
);
