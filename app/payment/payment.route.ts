import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware"; // Error handler middleware
import { processPaymentHandler } from "./payment.controller"; // Controller methods

const router = Router();


router.post("/", catchError, processPaymentHandler);

export default router;
