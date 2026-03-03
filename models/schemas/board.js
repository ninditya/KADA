import mongoose from 'mongoose';

const { Schema } = mongoose;

//  mendefinisikan struktur note (author, title, content) dan timestamps.
const PostSchema = new Schema(
  {
    author: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export default PostSchema;
