import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../minddlewares/multer.middleware.js";


const userRouter = Router();
userRouter.route("/register").post(
        upload.fields([
                {
                        name: "avatar",
                        maxCount: 1
                },
                {
                        name: "CoverImage",
                        maxCount: 1
                }
        ]),
        registerUser
)

export default userRouter;