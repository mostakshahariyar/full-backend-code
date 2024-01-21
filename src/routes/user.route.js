import { Router } from "express";
import { avatarUpdate, coverUpdate, currentPasswordChange, currentUser, getUserChannelProfile, getWatchHistoryChannel, logOutUser, loginUser, refreshAccessToken, registerUser, updateAccountDetails } from "../controllers/user.controller.js";
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
userRouter.route("/refresh-token").post(
        refreshAccessToken
);
// change password
userRouter.route("/change-password").post(
        verifyJWT,
        currentPasswordChange
);
// current user
userRouter.route("/current-user").get(verifyJWT, currentUser);
// update account details
userRouter.route("/update-account-details").patch(verifyJWT, updateAccountDetails);
// avatar imager update
userRouter.route("/avatar-update").patch(verifyJWT, upload.single(
        "avatar"
),
        avatarUpdate
);
// cover image update
userRouter.route("/cover-image-update").patch(verifyJWT, upload.single("coverImage"), coverUpdate);
// channel profile
userRouter.route("/c/:userName").get(verifyJWT, getUserChannelProfile)

// user watch history
userRouter.route("/watch-history").get(verifyJWT, getWatchHistoryChannel);
export default userRouter;