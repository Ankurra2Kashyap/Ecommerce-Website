import { catchAsyncError } from "../middleware/catchAsyncError.js";
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const processPayment = catchAsyncError(async (req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount, description } = req.body;

    const myPayment = await stripe.paymentIntents.create({
        amount,
        currency: "inr",
        description, // Include the description here
        metadata: {
            company: "Ecommerce",
        },
    });

    res.status(200).json({ success: true, client_secret: myPayment.client_secret });
});

export const sendStripeApiKey = catchAsyncError(async (req, res, next) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
