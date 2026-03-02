import mongoose from 'mongoose';
import PostSchema from './schemas/board.js';
import UserSchema from './schemas/user.js';

const DB_CACHE_KEY = '__kadaDbCache__';

const cached = global[DB_CACHE_KEY] || {
  notesConn: null,
  userConn: null,
  notesPromise: null,
  userPromise: null
};

global[DB_CACHE_KEY] = cached;

export async function connectDatabases() {
  const notesUri = process.env.NOTES_MONGO_URI;
  const userUri = process.env.USER_MONGO_URI;

  if (!notesUri) {
    throw new Error('NOTES_MONGO_URI is not defined');
  }

  if (!userUri) {
    throw new Error('USER_MONGO_URI is not defined');
  }

  if (!cached.notesConn) {
    if (!cached.notesPromise) {
      const notesConnection = mongoose.createConnection(notesUri);
      cached.notesPromise = notesConnection.asPromise();
    }
    cached.notesConn = await cached.notesPromise;
  }

  if (!cached.userConn) {
    if (!cached.userPromise) {
      const userConnection = mongoose.createConnection(userUri);
      cached.userPromise = userConnection.asPromise();
    }
    cached.userConn = await cached.userPromise;
  }

  if (!cached.notesConn.models.Post) {
    cached.notesConn.model('Post', PostSchema);
  }

  if (!cached.userConn.models.User) {
    cached.userConn.model('User', UserSchema);
  }

  return {
    notesConn: cached.notesConn,
    userConn: cached.userConn
  };
}

export function getModels() {
  if (!cached.notesConn || !cached.userConn) {
    throw new Error('Databases are not connected. Call connectDatabases() first.');
  }

  return {
    Post: cached.notesConn.model('Post'),
    User: cached.userConn.model('User')
  };
}
