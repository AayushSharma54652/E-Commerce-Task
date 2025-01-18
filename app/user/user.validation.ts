import { body } from "express-validator";


export const createUser = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isString()
    .withMessage("Role must be a string")
    .isIn(["CUSTOMER", "ADMIN"])
    .withMessage("Role must be either 'CUSTOMER' or 'ADMIN'"),
  body("active")
    .optional()
    .isBoolean()
    .withMessage("Active must be a boolean"),
];

export const updateUser = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("password")
    .optional()
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isString()
    .withMessage("Role must be a string")
    .isIn(["CUSTOMER", "ADMIN"])
    .withMessage("Role must be either 'CUSTOMER' or 'ADMIN'"),
  body("active")
    .optional()
    .isBoolean()
    .withMessage("Active must be a boolean"),
];


export const loginUser = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
