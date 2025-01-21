import { Request, Response } from "express";
import { createResponse } from "../common/helper/response.hepler";
import * as paymentService from "./payment.service";

/**
 * Handles the payment request and processes the payment.
 * @async
 * @param {Request} req - The Express request object, containing payment details.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>}
 */
export const processPaymentHandler = async (req: Request, res: Response): Promise<void> => {
  const { amount, cardNumber, expiryDate, cvv } = req.body;

  // Validate the required payment details
  if (!amount || !cardNumber || !expiryDate || !cvv) {
    res.status(400).send(createResponse(null, "Missing required payment details"));
    return;
  }

  // Call the service to process the payment
  const paymentResult = await paymentService.processPayment(amount, cardNumber, expiryDate, cvv);

  if (paymentResult) {
    res.status(200).send(createResponse(paymentResult, "Payment processed successfully"));
  } else {
    res.status(400).send(createResponse(null, "Payment failed. Invalid card or amount exceeds limit"));
  }
};
