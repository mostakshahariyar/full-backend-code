import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
        {
                userName: {
                        type: String,
                        required: true,
                        unique: true,
                        lowercase: true,
                        trim: true,
                        index: true
                },
                email: {
                        type: String,
                        required: true,
                        unique: true,
                        lowercase: true,
                        trim: true,
                },
                fullName: {
                        type: String,
                        required: true,
                        trim: true,
                        index: true
                },
                avatar: {
                        type: String, //cloudinary url
                        required: true,
                },
                coverImage: {
                        type: String, //cloudinary url

                },
                watchHistory: [
                        {
                                type: Schema.Types.ObjectId,
                                ref: "Video"
                        }
                ],
                password: {
                        type: String,
                        required: [true, "password is required"]
                },
                refreshToken: {
                        type: String
                }
        }
        , { timestamps: true });
// user inbuild middleware
userSchema.pre("save", async function (next) {
        if (!this.isModified(this.password)) return next(); //check password modified or not

        this.password = await bcrypt.hash(this.password, 8)
        next();
})
// plugins custom methods
userSchema.methods.isPasswordCorrect = async function (password) {
        return await bcrypt.compare(this.password, password)
}
userSchema.methods.generateAccessToken = async function () {
        return jwt.sign(
                {
                        _id: this._id,
                        userName: this.userName,
                        email: this.email,
                        fullName: this.fullName
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
                }
        )
};
userSchema.methods.generateRefreshToken = async function () {
        return jwt.sign(
                {
                        _id: this._id,

                },
                process.env.REFRESH_TOKEN_SECRET,
                {
                        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
                }
        )
};

export const User = mongoose.model('User', userSchema);