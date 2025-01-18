import jwt from "jsonwebtoken";
import { IUser } from "../../user/user.dto"; // User DTO for type safety
import { config } from "dotenv";

// Load environment variables
config();

interface TokenPayload {
  _id: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export const generateTokens = (payload: TokenPayload) => {
  // Clone the payload to avoid mutating the original object
  const { ...cleanedPayload } = payload;  // Remove any existing 'exp' field

  const accessToken = jwt.sign(cleanedPayload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m", // Short-lived access token
  });

  const refreshToken = jwt.sign(cleanedPayload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d", // Long-lived refresh token
  });

  return { accessToken, refreshToken };
};


// Verify the access token
export const verifyAccessToken = (token: string): IUser | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as IUser;
    return decoded;
  } catch (error) {
    return null; // Token is invalid or expired
  }
};

// Verify the refresh token
export const verifyRefreshToken = (token: string): IUser | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as IUser;
    return decoded;
  } catch (error) {
    return null; // Token is invalid or expired
  }
};

// Refresh the access token using a valid refresh token
export const refreshAccessToken = (refreshToken: string): string | null => {
  const user = verifyRefreshToken(refreshToken);
  if (user) {
    return generateTokens(user).accessToken; // Generate a new access token if refresh token is valid
  }
  return null; // Invalid refresh token
};
