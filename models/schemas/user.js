import mongoose from 'mongoose';
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const { Schema } = mongoose;
const scrypt = promisify(_scrypt);

const UserSchema = new Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, minlength: 6, select: false }
  },
  { timestamps: true }
);

// sebelum user disimpan, password plaintext di-hash jadi format salt:hash.
UserSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;

  const salt = randomBytes(16).toString('hex');
  const key = await scrypt(this.password, salt, 64);
  this.password = `${salt}:${key.toString('hex')}`;
});

// saat login, password input di-hash ulang dengan salt lama lalu dibandingkan aman (timingSafeEqual).
UserSchema.methods.verifyPassword = async function verifyPassword(candidatePassword) {
  if (!this.password || !this.password.includes(':')) return false;

  const [salt, storedHash] = this.password.split(':');
  const candidateHash = await scrypt(candidatePassword, salt, 64);
  return timingSafeEqual(Buffer.from(storedHash, 'hex'), candidateHash);
};

//  menghapus field password dari response API.
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  }
});

export default UserSchema;
