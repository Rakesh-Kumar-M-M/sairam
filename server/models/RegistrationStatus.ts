import mongoose, { Schema, Document } from 'mongoose';
import { RegistrationStatus } from '@shared/schema';

export interface IRegistrationStatusDocument extends RegistrationStatus, Document {}

const RegistrationStatusSchema = new Schema<IRegistrationStatusDocument>({
  isOpen: {
    type: Boolean,
    required: true,
    default: true
  },
  message: {
    type: String,
    required: false
  },
  closedAt: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Create a compound index to ensure only one status record exists
RegistrationStatusSchema.index({}, { unique: true });

export const RegistrationStatusModel = mongoose.model<IRegistrationStatusDocument>('RegistrationStatus', RegistrationStatusSchema);
