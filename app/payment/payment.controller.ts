import { Request, Response } from "express";
import { createResponse } from "../common/helper/response.hepler"; // Helper for standard responses

// Controller to process payment (dummy)
export const processPaymentHandler = async (req: Request, res: Response): Promise<void> => {
  const { amount, cardNumber, expiryDate, cvv } = req.body;

  // For testing purposes, simulate success or failure based on the card number or amount
  if (!amount || !cardNumber || !expiryDate || !cvv) {
    res.status(400).send(createResponse(null, "Missing required payment details"));
    return;
  }

  // Simulate payment success or failure based on card number
  const isValidCard = cardNumber.startsWith("4"); // Assume card starting with '4' is valid for success
  const paymentSuccessful = isValidCard && amount <= 1000; // Example condition: max amount $1000

  if (paymentSuccessful) {
    // Simulate a successful payment response
    res.status(200).send(createResponse({ transactionId: "txn12345", status: "success" }, "Payment processed successfully"));
  } else {
    // Simulate a failed payment response
    res.status(400).send(createResponse(null, "Payment failed. Invalid card or amount exceeds limit"));
  }
};
