import { Router } from "express";
import * as userController from "./user.controller";
import * as userValidation from "./user.validation";
import { authMiddleware } from "../common/middleware/auth.middleware"; // Assuming auth middleware checks JWT
import { catchError } from "../common/middleware/cath-error.middleware"; // Assuming custom error handler

const router = Router();

// Route to register a new user
router.post(
  "/register",
  userValidation.createUser,
  catchError,
  userController.registerUserHandler
);

// Route to login a user
router.post(
  "/login",
  userValidation.loginUser,
  catchError,
  userController.loginUserHandler
);

// Route to get the current user's profile (protected)
router.get(
  "/profile",
  authMiddleware,
  userController.getUserProfileHandler
);

// Route to update the current user's profile (protected)
router.put(
  "/profile",
  authMiddleware,
  userValidation.updateUser,
  catchError,
  userController.updateUserProfileHandler
);

// Route for logging out the user
router.post(
  "/logout",
  authMiddleware, // Optionally protect this route if needed
  catchError,
  userController.logoutUserHandler
);

export default router;
