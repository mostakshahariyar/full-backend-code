import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const registerUser = asyncHandler(async (req, res) => {
        // get user details from frontend
        // validation - fill all full fields
        // check if user is already logged in : [check for user name and email]
        // check file filled or not [ check image and avatar]
        // upload image to cloudinary server , avatar 
        // create user object - create entry in db
        // remove password and refresh token field from response
        // check for user creation -> if -> true -> return user
        const { fullName, email, password, userName } = req.body;
        console.log("email: " + email)
        if (
                [fullName, email, password, userName].some((field) => field?.trim() === "")
        ) {
                throw new ApiError(400, "All field are required")
        }
        const existUser = User.findOne({
                $or: [{ email }, { userName }]
        })

        if (existUser) {
                throw new ApiError(409, "Email already logged in");
        }
        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.files?.CoverImage[0]?.path;
        if (!avatarLocalPath) {
                throw new ApiError(400, "Missing avatar");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);
        if (!avatar) {
                throw new ApiError(400, "Missing Avatar")
        }
        const user = await User.create(
                {
                        fullName,
                        avatar: avatar.url,
                        coverImage: coverImage?.url || "",
                        email,
                        password,
                        userName: userName.toLowerCase()
                }
        )
        const createdUser = await User.findById(user._id).select(
                "-password -refreshToken"
        )

        if (!createdUser) {
                throw new ApiError(500, "Something went wrong while registering the user")
        }
        return res.status(201).json(
                new ApiResponse(200, createdUser, "Successfully registered")
        )



})

export { registerUser };