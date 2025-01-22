import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createResponse } from "../helper/response.hepler";

type UserRole = "ADMIN" | "CUSTOMER";

interface DecodedToken {
  role: UserRole;
  id: string;
  email: string;
  name: string;
  exp?: number;
  iat?: number;
}

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get the refresh token from cookies
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(401).send(createResponse(null, "Authentication required"));
      return;
    }

    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as DecodedToken;

    // Check if the user is an admin
    if (decoded.role !== "ADMIN") {
      res.status(403).send(createResponse(null, "Access denied. Admins only."));
      return;
    }

    // Optionally attach the decoded token to the request for later use
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).send(createResponse(null, "Refresh token has expired"));
    } else {
      res.status(401).send(createResponse(null, "Invalid refresh token"));
    }
  }
};