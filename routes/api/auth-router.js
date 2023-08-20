import express from "express";
import userSchema from "../../schemas/user-schemas.js";
import { validateBody } from "../../decorators/index.js";
import authController from "../../controllers/auth/auth-controller.js";
import { authenticate, upload } from "../../middlewares/index.js";


const authRouter = express.Router();

authRouter.post("/signup", validateBody(userSchema.userSignupSchema), authController.signup);

authRouter.get("/verify/:verificationCode", authController.verify);

authRouter.post("/verify", validateBody(userSchema.userEmailSchema, authController.resendVerifyEmai))

authRouter.post("/signin", validateBody(userSchema.userSigninSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate, authController.signout);

authRouter.patch("/users/avatars", authenticate, upload.single("avatar"), authController.updateAvatar);

export default authRouter;