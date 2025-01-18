import mongoose, { Schema, Document, CallbackError } from "mongoose";
import bcrypt from "bcryptjs"; // For password hashing
import { IUser } from "./user.dto"; // Import the IUser interface

// User schema definition
const UserSchema: Schema = new Schema<IUser & Document>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures email is unique in the database
      lowercase: true, // Automatically convert email to lowercase
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Password length validation
    },
    refreshToken: {
      type: String,
      required: false,
      default: null, // Refresh token is optional, only when user logs in
    },
    role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN"],
      required: true,
      default: "CUSTOMER",
    },
    active: {
      type: Boolean,
      default: true, // Default value for active status
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);


const UserModel = mongoose.model<IUser & Document>("User", UserSchema);

export default UserModel;
