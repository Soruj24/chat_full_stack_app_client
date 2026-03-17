import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen?: Date;
  phoneNumber?: string;
  username: string;
  bio?: string;
  starredMessages: mongoose.Types.ObjectId[];
  settings: {
    showNotifications: boolean;
    messagePreview: boolean;
    soundEffects: boolean;
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    accentColor: string;
    bubbleStyle: 'modern' | 'classic' | 'rounded';
    readReceipts: boolean;
    lastSeenVisibility: 'everyone' | 'contacts' | 'nobody';
    twoFactorAuth: boolean;
    notificationSound: string;
  };
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String, default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  lastSeen: { type: Date, default: Date.now },
  phoneNumber: { type: String },
  username: { type: String, unique: true, required: true },
  bio: { type: String, default: '' },
  starredMessages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  settings: {
    showNotifications: { type: Boolean, default: true },
    messagePreview: { type: Boolean, default: true },
    soundEffects: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
    accentColor: { type: String, default: '#3b82f6' },
    bubbleStyle: { type: String, enum: ['modern', 'classic', 'rounded'], default: 'modern' },
    readReceipts: { type: Boolean, default: true },
    lastSeenVisibility: { type: String, enum: ['everyone', 'contacts', 'nobody'], default: 'everyone' },
    twoFactorAuth: { type: Boolean, default: false },
    notificationSound: { type: String, default: 'default' },
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
