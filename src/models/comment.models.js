import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commnetSchema = new Schema({
        content: {
                type: String,
                required: true
        },

        video: {
                type: Schema.Types.ObjectId,
                ref: "Video"

        },
        owner: {
                type: Schema.Types.ObjectId,
                ref: "User"
        }
}, { timestamps: true });


commnetSchema.plugin(mongooseAggregatePaginate)
export const Commnet = mongoose.model("Commnet", commnetSchema);