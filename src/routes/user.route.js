import { Router } from "express";
import { logOutUser, loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../minddlewares/multer.middleware.js";
import { verifyJWT } from "../minddlewares/Auth.middleware.js";


const userRouter = Router();
userRouter.route("/register").post(
        upload.fields([
                {
                        name: "avatar",
                        maxCount: 1
                },
                {
                        name: "coverImage",
                        maxCount: 1
                }
        ]),
        registerUser
)
userRouter.route("/login").post(
        loginUser
)

userRouter.route("/logout").post(
        verifyJWT,
        logOutUser
)

export default userRouter;