// Importing with .mjs extension (for ESM)
import express from 'express';
import { createProductReview, deleteReview, getAllProducts, getProductDetails, getProductReviews } from '../controllers/productController.js'; // Note the .mjs extension
import { createProduct } from '../controllers/productController.js';
import { updateProduct } from '../controllers/productController.js';
import { deleteProduct } from '../controllers/productController.js';
import { isAuthenticatedErrors,authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedErrors,authorizeRoles("admin"),createProduct);
router.route("/admin/product/:id").put(isAuthenticatedErrors,authorizeRoles("admin"),updateProduct).delete(isAuthenticatedErrors,authorizeRoles("admin"),deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedErrors,createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedErrors,deleteReview);
export default router;
