// import mongoose and mongoose-aggregate-paginate-v2 
import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Defining the Video schema
const videoSchema = new Schema(
  {
    videofile: {
      type: String, // Cloudinary URL
      required: true,
    },
    thumbnaile: {
      type: String, // Cloudinary URL
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // From Cloudinary
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublish: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Adding pagination plugin to the video schema
videoSchema.plugin(mongooseAggregatePaginate)

// Exporting the video model
export const video = mongoose.model("video", videoSchema);
