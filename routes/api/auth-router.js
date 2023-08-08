import express from "express";
import userSchema from "../../schemas/user-schemas.js";
import { validateBody } from "../../decorators/index.js";
import authController from "../../controllers/auth/auth-controller.js";


const authRouter = express.Router();

authRouter.post("/singup", validateBody(userSchema.userSignupSchema), authController.signup);

export default authRouter;