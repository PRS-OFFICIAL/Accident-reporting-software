import userController from "../controllers/user.controller.js";
import { Router } from "express";
import multer from "multer";
const userRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

userRouter.route('/getUser').get(userController.getUser);
console.log("user endpoint reached")
userRouter.route('/createuser').post(upload.single('image'),userController.createUser);
userRouter.route('/deleteUser').delete(userController.deleteUser);
userRouter.route('/updateUser').put(userController.updateUser);
userRouter.route('/updateStatus').put(userController.updateStatus);

export default userRouter;