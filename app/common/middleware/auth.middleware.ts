import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createResponse } from "../helper/response.hepler";
import { IUser, } from "../../user/user.dto";
import { BaseSchema } from "../../common/dto/base.dto"
// Define the User type for the request object
type User = Omit<IUser, 'password' | 'refreshToken'>;

// TokenPayload should match User type
interface TokenPayload extends Omit<BaseSchema, 'deletedAt'> {
  _id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper function to extract payload without exp claim and sensitive data
const extractPayload = (user: any): User => {
  const { exp, iat, password, refreshToken, ...payload } = user;
  return payload;
};

export const generateTokens = (user: IUser) => {
  // Create a clean payload without sensitive data
  const payload = extractPayload(user);

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): User | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as TokenPayload & { exp: number; iat: number };
    return extractPayload(decoded);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): User | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as TokenPayload & { exp: number; iat: number };
    return extractPayload(decoded);
  } catch (error) {
    return null;
  }
};

export const refreshAccessToken = (refreshToken: string): string | null => {
  const payload = verifyRefreshToken(refreshToken);
  if (payload) {
    // Generate new access token with clean payload
    const user = { ...payload, refreshToken } as IUser;
    return generateTokens(user).accessToken;
  }
  return null;
};

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(401).send(createResponse(null, "Authentication required"));
      return;
    }

    const newAccessToken = refreshAccessToken(refreshToken);

    if (!newAccessToken) {
      res.status(401).send(createResponse(null, "Invalid or expired refresh token"));
      return;
    }

    res.setHeader("Authorization", `Bearer ${newAccessToken}`);
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as TokenPayload & { exp: number; iat: number };
    req.user = extractPayload(decoded);
    next();
  } catch (error) {
    res.status(401).send(createResponse(null, "Invalid or expired access token"));
  }
};