import express from "express";
import userSchema from "../../schemas/user-schemas.js";
import { validateBody } from "../../decorators/index.js";
import authController from "../../controllers/auth/auth-controller.js";


const authRouter = express.Router();

authRouter.post("/signup", validateBody(userSchema.userSignupSchema), authController.signup);

authRouter.post("/signin", validateBody(userSchema.userSigninSchema), authController.signin);

export default authRouter;