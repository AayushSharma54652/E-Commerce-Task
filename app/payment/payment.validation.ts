import { body } from "express-validator";

// Validation for the payment details
export const paymentValidation = [
  body("amount").isFloat({ gt: 0 }).withMessage("Amount should be greater than 0"),
  body("cardNumber").isLength({ min: 16, max: 16 }).withMessage("Card number should be 16 digits"),
  body("expiryDate").matches(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/).withMessage("Invalid expiry date format"),
  body("cvv").isLength({ min: 3, max: 3 }).withMessage("CVV should be 3 digits"),
];
