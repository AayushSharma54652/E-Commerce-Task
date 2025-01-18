import { Request, Response } from "express";
import { createResponse } from "../common/helper/response.hepler";

export const processPaymentHandler = async (req: Request, res: Response): Promise<void> => {
  const { amount, cardNumber, expiryDate, cvv } = req.body;

  if (!amount || !cardNumber || !expiryDate || !cvv) {
    res.status(400).send(createResponse(null, "Missing required payment details"));
    return;
  }

  const isValidCard = cardNumber.startsWith("4");
  const paymentSuccessful = isValidCard && amount <= 1000;

  if (paymentSuccessful) {
    res.status(200).send(createResponse({ transactionId: "txn12345", status: "success" }, "Payment processed successfully"));
  } else {
    res.status(400).send(createResponse(null, "Payment failed. Invalid card or amount exceeds limit"));
  }
};
