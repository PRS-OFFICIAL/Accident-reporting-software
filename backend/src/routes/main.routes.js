import { Router } from "express";
import userRouter from "./user.routes.js";
import adminRoutes from "./admin.routes.js";
import userController from "../controllers/user.controller.js";
import adminController from "../controllers/admin.controller.js";
const mainRoutes = Router();
console.log("main end point reached")
mainRoutes.use('/users',userRouter);
mainRoutes.use('/admin/logout',adminRoutes);

export default mainRoutes;
