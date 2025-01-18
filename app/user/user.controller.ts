import { Request, Response } from "express";
import asyncHandler from "express-async-handler"; // For handling async errors
import * as userService from "./user.service"; // Import the user service
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "./user.dto"; // Import the DTOs
import { createResponse } from "../common/helper/response.hepler"; // Helper function for standardized responses
import { generateTokens } from "../common/helper/token.helper"; // Helper function for generating tokens

// Controller to register a new user
export const registerUserHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role }: CreateUserDto = req.body;

    // Register the user using the user service
    const newUser = await userService.createUser({ name, email, password, role });

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = generateTokens({
      _id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    // Set the refresh token in the HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // set to true if using HTTPS
      sameSite: "strict",
    });

    // Send the access token as part of the response body
    res.status(201).send(
      createResponse(
        {
          user: {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
          accessToken, // Send the access token in the response body
        },
        "User registered successfully"
      )
    );
  }
);

// Controller for user login
export const loginUserHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password }: LoginUserDto = req.body;

    // Authenticate the user
    const { user, tokens } = await userService.loginUser({ email, password });

    // Set the refresh token in the HTTP-only cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true, // set to true if using HTTPS
      sameSite: "strict",
    });

    // Send the access token as part of the response body
    res.send(
      createResponse(
        {
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          },
          accessToken: tokens.accessToken, // Send the access token in the response body
        },
        "User logged in successfully"
      )
    );
  }
);

// Controller for logging out a user
export const logoutUserHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken; // Retrieve the refresh token from the cookies
  
    if (!refreshToken) {
      res.status(400).send(createResponse(null, "No refresh token provided"));
      return;
    }

    // Remove the refresh token from the user's document
    await userService.logoutUser(refreshToken);
  
    // Clear the cookie storing the refresh token
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
  
    res.status(200).send(createResponse(null, "User logged out successfully"));
  }
);


// Controller for getting the user's profile
export const getUserProfileHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).send(createResponse(null, "User not authenticated"));
      return;
    }

    const userId = req.user._id;

    // Get the user profile
    const user = await userService.getUserById(userId);

    // Return the user profile
    res.send(createResponse(user, "User profile retrieved successfully"));
  }
);

// Controller for updating user profile
export const updateUserProfileHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).send(createResponse(null, "User not authenticated"));
      return;
    }

    const userId = req.user._id;
    const updateData: UpdateUserDto = req.body;

    // Update the user profile
    const updatedUser = await userService.updateUser(userId, updateData);

    // Return the updated user profile
    res.send(createResponse(updatedUser, "User profile updated successfully"));
  }
);

// Controller to handle logout
