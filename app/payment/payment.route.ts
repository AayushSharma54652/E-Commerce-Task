import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware"; // Error handler middleware
import { processPaymentHandler } from "./payment.controller"; // Controller methods

const router = Router();

// Route for processing a payment (dummy)
router.post("/", catchError, processPaymentHandler);

export default router;
