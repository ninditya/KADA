import 'dotenv/config';
import mongoose from 'mongoose';
import PostSchema from './schemas/board.js';
import UserSchema from './schemas/user.js';

const notesUri = process.env.NOTES_MONGO_URI;
const userUri = process.env.USER_MONGO_URI;

if (!notesUri || !userUri) {
  throw new Error('Set env MONGO_URI atau kombinasi NOTES_MONGO_URI dan USER_MONGO_URI');
}

const notesConn = mongoose.createConnection();
const userConn = mongoose.createConnection();
let isConnected = false;

export const Post = notesConn.model('Post', PostSchema);
export const User = userConn.model('User', UserSchema);

export const connectDatabases = async () => {
  if (isConnected) {
    return;
  }

  await Promise.all([
    notesConn.openUri(notesUri),
    userConn.openUri(userUri),
  ]);

  isConnected = true;
};
