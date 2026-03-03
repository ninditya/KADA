import mongoose from 'mongoose';
import PostSchema from './schemas/board.js';
import UserSchema from './schemas/user.js';

let models = null;

// baca NOTES_MONGO_URI + USER_MONGO_URI, buka 2 koneksi Mongo, lalu inisialisasi model Post dan User.
export async function connectDatabases() {
  if (models) return models;

  const notesUri = process.env.NOTES_MONGO_URI;
  const userUri = process.env.USER_MONGO_URI;

  if (!notesUri || !userUri) {
    throw new Error('NOTES_MONGO_URI and USER_MONGO_URI are required');
  }

  const notesConn = await mongoose.createConnection(notesUri).asPromise();
  const userConn = await mongoose.createConnection(userUri).asPromise();

  models = {
    Post: notesConn.model('Post', PostSchema),
    User: userConn.model('User', UserSchema)
  };

  return models;
}

// mengembalikan model siap pakai ke router; jika DB belum connect akan throw error.
export function getModels() {
  if (!models) {
    throw new Error('Database is not connected. Call connectDatabases() first.');
  }
  return models;
}
