import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";


const generateAccessTokenAndRefreshToken = async (userId) => {
        try {
                const user = await User.findById(userId);

                const accessToken = user.generateAccessToken();
                const refreshToken = user.generateRefreshToken();

                user.refreshToken = refreshToken;

                await user.save({ validateBeforeSave: false });

                return { accessToken, refreshToken }

        } catch (error) {
                throw new ApiError(500, "Something failed to generate access token");
        }
}

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
        if (
                [fullName, email, password, userName].some((field) => field?.trim() === "")
        ) {
                throw new ApiError(400, "All field are required")
        }
        const existUser = await User.findOne({
                $or: [{ email }, { userName }]
        })

        if (existUser) {
                throw new ApiError(409, "Email already logged in");
        }
        const avatarLocalPath = await req.files?.avatar[0]?.path;
        // const coverImageLocalPath = await req.files?.coverImage[0]?.path;
        let coverImageLocalPath;
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
                coverImageLocalPath = req.files.coverImage[0].path;
        }
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
                        userName: userName.toLowerCase(),
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

const loginUser = asyncHandler(async (req, res) => {
        // req body
        // username or email
        // find the user
        // password check
        // access and refresh token
        // send cookies 
        const { email, password, userName } = req.body;

        if (!(userName || email)) {
                throw new ApiError(400, "User name or email is required")
        }

        const user = await User.findOne({
                $or: [{ userName }, { email }]              //find email or username 
        })
        if (!user) {
                throw new ApiError(400, "User does not exist");
        }
        const isPassword = await user.isPasswordCorrect(password);
        if (!isPassword) {
                throw new ApiError(401, "Invalid user credentials");
        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)
        // user.accessToken = accessToken;
        // user.refreshToken = refreshToken;
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        // cookies 
        const option = {
                httpOnly: true,
                secure: true,
        }
        return res.status(200)
                .cookie("accessToken", accessToken, option)
                .cookie("refreshToken", refreshToken, option)
                .json(
                        new ApiResponse(
                                200,
                                {
                                        loggedInUser,
                                        accessToken,
                                        refreshToken

                                },
                                "User logged in successfully"));

})

const logOutUser = asyncHandler(async (req, res) => {
        // clean cookies
        const logoutUser = await User.findByIdAndUpdate(req.user._id, {
                $set: {
                        refreshToken: undefined,
                }
        }, {
                new: true,
        })

        const option = {
                httpOnly: true,
                secure: true,
                path: '/'
        }
        return res.status(200)
                .clearCookie("accessToken", option)
                .clearCookie("refreshToken", option)
                .json(new ApiResponse(200, {}, "User successfully logged out"))

})



const refreshAccessToken = asyncHandler(async (req, res) => {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) {
                throw new ApiError(401, "Unauthorized access")
        }
        try {
                const decodedToken = jwt.verify(
                        incomingRefreshToken,
                        process.env.REFRESH_TOKEN_SECRET
                )
                const user = await User.findById(decodedToken?._id)
                if (!user) {
                        throw new ApiError(401, "Invalid refresh token");
                }
                if (incomingRefreshToken !== user?.refreshToken) { throw new ApiError(401, "Refresh token expired"); }

                const option = {
                        httpOnly: true,
                        secure: true,
                }
                const { accessToken, newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id)
                return res.status(200)
                        .cookie("accessToken", accessToken, option)
                        .cookie("refreshToken", newRefreshToken, option)
                        .json(
                                new ApiResponse(
                                        200,
                                        {
                                                accessToken: accessToken,
                                                refreshToken: newRefreshToken
                                        },
                                        "Access Token refreshed successfully"
                                )
                        )
        } catch (error) {
                throw new ApiError(401, error?.messge || "Invalid access token")
        }

});

export { registerUser, loginUser, logOutUser, refreshAccessToken };