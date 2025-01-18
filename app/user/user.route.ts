import { Router } from "express";
import * as userController from "./user.controller";
import * as userValidation from "./user.validation";
import { authMiddleware } from "../common/middleware/auth.middleware";
import { catchError } from "../common/middleware/cath-error.middleware";

const router = Router();

router.post(
  "/register",
  userValidation.createUser,
  catchError,
  userController.registerUserHandler
);

router.post(
  "/login",
  userValidation.loginUser,
  catchError,
  userController.loginUserHandler
);

router.get(
  "/profile",
  authMiddleware,
  userController.getUserProfileHandler
);

router.put(
  "/profile",
  authMiddleware,
  userValidation.updateUser,
  catchError,
  userController.updateUserProfileHandler
);

router.post(
  "/logout",
  authMiddleware,
  catchError,
  userController.logoutUserHandler
);

export default router;
