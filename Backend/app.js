// app.js (assuming .mjs extension for ESM)
import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { errorMiddleware } from './middleware/error.js';
import dotenv from 'dotenv';

dotenv.config({ path: "backend/config/config.env" });
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
// Importing with .js extension (for CommonJS)
import product from './routes/productRoute.js'; // Note the .js extension
import user from './routes/userRoute.js'
import order from "./routes/orderRoute.js";
import payment from "./routes/paymentRoute.js";
app.use('/api/v1', product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

//Middleware for Errors
app.use(errorMiddleware);
export default app;
