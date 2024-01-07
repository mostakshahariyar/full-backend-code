import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
        {
                videoFile: {
                        type: String, // cloudinary 
                        required: true,
                },
                thumbnail: {
                        type: String, // cloudinary
                        required: true
                },
                title: {
                        type: String,
                        required: true
                },
                description: {
                        type: String,
                        required: true
                },
                duration: {
                        type: String, // cloudinary
                        required: true
                },
                viwes: {
                        type: Number,
                        default: 0
                },
                isPublic: {
                        type: Boolean,
                        // required: true
                },
                owner: {
                        type: Schema.Types.ObjectId,
                        ref: "User"
                }
        }
        , { timestamps: true });

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model('Video', videoSchema);