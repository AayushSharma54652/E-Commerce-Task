import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as userService from "./user.service";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "./user.dto";
import { createResponse } from "../common/helper/response.hepler";
import { generateTokens } from "../common/helper/token.helper";

export const registerUserHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role }: CreateUserDto = req.body;
    const newUser = await userService.createUser({ name, email, password, role });

    const { accessToken, refreshToken } = generateTokens({
      _id: newUser._id.toString(),
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
            id: newUser._id.toString(),
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
            id: user._id.toString(),
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

export const getUserProfileHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).send(createResponse(null, "User not authenticated"));
      return;
    }

    const userId = req.user._id;
    const user = await userService.getUserById(userId);

    res.send(createResponse(user, "User profile retrieved successfully"));
  }
);

export const updateUserProfileHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).send(createResponse(null, "User not authenticated"));
      return;
    }

    const userId = req.user._id;
    const updateData: UpdateUserDto = req.body;

    const updatedUser = await userService.updateUser(userId, updateData);

    res.send(createResponse(updatedUser, "User profile updated successfully"));
  }
);
