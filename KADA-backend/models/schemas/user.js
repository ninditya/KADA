import mongoose from 'mongoose';

const { Schema } = mongoose;

const LoginSchema = new Schema(
  {
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    passwordHash: { 
        type: String, 
        required: true 
    } // simpan hash, bukan plaintext
  },
  { timestamps: true }
);

export default LoginSchema;
