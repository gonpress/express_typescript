import * as mongoose from "mongoose";
import Post from "./post.interface";

const PostSchema = new mongoose.Schema(
    {
        title: String,
        content: String,
        author: String,
    },
    {
        timestamps: true,
    }
);

const postModel = mongoose.model<Post & mongoose.Document>('Post', PostSchema);

export default postModel;