import express from 'express';
import { authorizeRoles, isAuthenticatedErrors } from '../middleware/auth.js';
const router = express.Router();
import { DeleteUser, getAllUser, getAllUserAdmin, getUserDetails, logout, registerUser, resetPassword, updatePassword, updateRole } from '../controllers/userController.js';
import { loginUser } from '../controllers/userController.js';
import { forgotPassword } from '../controllers/userController.js';
import { updateProfile } from '../controllers/userController.js';
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedErrors,getUserDetails)
router.route("/password/update").put(isAuthenticatedErrors,updatePassword)
router.route("/me/update").put(isAuthenticatedErrors,updateProfile)
router.route("/admin/users").get(isAuthenticatedErrors,authorizeRoles("admin"),getAllUser);
router.route("/admin/user/:id").get(isAuthenticatedErrors,authorizeRoles("admin"),getAllUserAdmin).put(isAuthenticatedErrors,authorizeRoles("admin"),updateRole).delete(isAuthenticatedErrors,authorizeRoles("admin"),DeleteUser);

export default router;