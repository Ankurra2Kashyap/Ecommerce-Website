import express from "express";
import { processPayment } from "../controllers/paymentController.js";
import { sendStripeApiKey } from "../controllers/paymentController.js";
const router = express.Router();
import { isAuthenticatedErrors } from "../middleware/auth.js";
router.route("/payment/process").post(isAuthenticatedErrors,processPayment);
router.route("/stripeapikey").get(isAuthenticatedErrors,sendStripeApiKey);

export default router;