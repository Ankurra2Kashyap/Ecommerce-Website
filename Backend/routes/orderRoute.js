import express from "express";
import { deleteOrder, getAllOrders, getSingleOrder, myOrders, newOrder, updateOrder } from "../controllers/orderController.js";
// const router = express.Router();
const router = express.Router();

import { isAuthenticatedErrors } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/auth.js";

router.route("/order/new").post(isAuthenticatedErrors,newOrder)
router.route("/order/:id").get(isAuthenticatedErrors,getSingleOrder);
router.route("/orders/me").get(isAuthenticatedErrors,myOrders)
router.route("/admin/orders").get(isAuthenticatedErrors,authorizeRoles("admin"),getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedErrors,authorizeRoles("admin"),updateOrder).delete(isAuthenticatedErrors,authorizeRoles("admin"),deleteOrder);
export default router;