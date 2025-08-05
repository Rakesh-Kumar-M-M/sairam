import mongoose, { Schema, Document } from 'mongoose';
import { IRegistration } from '@shared/schema';

export interface IRegistrationDocument extends IRegistration, Document {}

const RegistrationSchema = new Schema<IRegistrationDocument>({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    minlength: [2, 'Full name must be at least 2 characters']
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    enum: {
      values: ['I', 'II', 'III', 'IV'],
      message: 'Year must be I, II, III, or IV'
    }
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    minlength: [2, 'Department must be at least 2 characters']
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    minlength: [1, 'Section is required']
  },
  secId: {
    type: String,
    required: [true, 'Student ID is required'],
    minlength: [1, 'SEC ID is required']
  },
  college: {
    type: String,
    required: [true, 'College is required'],
    minlength: [2, 'College name must be at least 2 characters']
  },
  preferredCountry: {
    type: String,
    required: [true, 'Preferred country is required'],
    minlength: [2, 'Preferred country must be at least 2 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Phone number must be exactly 10 digits']
  },
  committee: {
    type: String,
    required: [true, 'Committee selection is required'],
    enum: {
      values: ['UNEP', 'UNSC'],
      message: 'Committee must be UNEP or UNSC'
    }
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentScreenshot: {
    type: String,
    required: false // Optional field for payment screenshot (base64 or URL)
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
RegistrationSchema.index({ fullName: 1 });
RegistrationSchema.index({ secId: 1 });
RegistrationSchema.index({ phoneNumber: 1 });
RegistrationSchema.index({ paymentStatus: 1 });
RegistrationSchema.index({ createdAt: -1 });

// Check if model already exists to prevent OverwriteModelError
export const Registration = mongoose.models.Registration || mongoose.model<IRegistrationDocument>('Registration', RegistrationSchema); 