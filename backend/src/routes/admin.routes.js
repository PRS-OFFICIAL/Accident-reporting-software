import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import verifyToken from "../middleware/auth.middleware.js";
const adminRoutes = Router();

adminRoutes.route('/getUser').get(verifyToken,adminController.getAdmin);
adminRoutes.route('/deleteUser').delete(adminController.deleteAdmin);
adminRoutes.route('/updateUser').put(adminController.updateAdmin);
adminRoutes.route('/logout').post(verifyToken,adminController.logout);
adminRoutes.route('/login').post(adminController.login);
adminRoutes.route('/signup').post(adminController.signup);

export default adminRoutes;