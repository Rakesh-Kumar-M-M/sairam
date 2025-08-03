import { Registration, IRegistration } from './models/Registration';
import { type InsertRegistration } from '@shared/schema';

export interface IMongoStorage {
  createRegistration(registration: InsertRegistration): Promise<IRegistration>;
  getRegistration(id: string): Promise<IRegistration | null>;
  getAllRegistrations(): Promise<IRegistration[]>;
  updatePaymentStatus(id: string, status: 'pending' | 'completed' | 'failed'): Promise<IRegistration | null>;
  deleteRegistration(id: string): Promise<boolean>;
  getRegistrationsByStatus(status: 'pending' | 'completed' | 'failed'): Promise<IRegistration[]>;
  getRegistrationsByCollege(college: string): Promise<IRegistration[]>;
  getRegistrationsByYear(year: 'I' | 'II' | 'III' | 'IV'): Promise<IRegistration[]>;
  searchRegistrations(query: string): Promise<IRegistration[]>;
  getRegistrationStats(): Promise<{
    total: number;
    pending: number;
    completed: number;
    failed: number;
    revenue: number;
  }>;
}

export class MongoStorage implements IMongoStorage {
  async createRegistration(registrationData: InsertRegistration): Promise<IRegistration> {
    try {
      const registration = new Registration({
        ...registrationData,
        paymentStatus: 'pending',
        createdAt: new Date()
      });
      
      const savedRegistration = await registration.save();
      console.log(`✅ Created new registration: ${savedRegistration.fullName} (ID: ${savedRegistration._id})`);
      return savedRegistration;
    } catch (error) {
      console.error('❌ Error creating registration:', error);
      throw error;
    }
  }

  async getRegistration(id: string): Promise<IRegistration | null> {
    try {
      const registration = await Registration.findById(id);
      return registration;
    } catch (error) {
      console.error('❌ Error fetching registration:', error);
      throw error;
    }
  }

  async getAllRegistrations(): Promise<IRegistration[]> {
    try {
      const registrations = await Registration.find().sort({ createdAt: -1 });
      console.log(`📊 Fetched ${registrations.length} registrations from MongoDB`);
      return registrations;
    } catch (error) {
      console.error('❌ Error fetching all registrations:', error);
      throw error;
    }
  }

  async updatePaymentStatus(id: string, status: 'pending' | 'completed' | 'failed'): Promise<IRegistration | null> {
    try {
      const registration = await Registration.findByIdAndUpdate(
        id,
        { paymentStatus: status },
        { new: true }
      );
      
      if (registration) {
        console.log(`✅ Updated payment status for ${registration.fullName}: ${status}`);
      }
      
      return registration;
    } catch (error) {
      console.error('❌ Error updating payment status:', error);
      throw error;
    }
  }

  async deleteRegistration(id: string): Promise<boolean> {
    try {
      const result = await Registration.findByIdAndDelete(id);
      if (result) {
        console.log(`🗑️ Deleted registration: ${result.fullName}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error deleting registration:', error);
      throw error;
    }
  }

  async getRegistrationsByStatus(status: 'pending' | 'completed' | 'failed'): Promise<IRegistration[]> {
    try {
      const registrations = await Registration.find({ paymentStatus: status }).sort({ createdAt: -1 });
      return registrations;
    } catch (error) {
      console.error('❌ Error fetching registrations by status:', error);
      throw error;
    }
  }

  async getRegistrationsByCollege(college: string): Promise<IRegistration[]> {
    try {
      const registrations = await Registration.find({ college }).sort({ createdAt: -1 });
      return registrations;
    } catch (error) {
      console.error('❌ Error fetching registrations by college:', error);
      throw error;
    }
  }

  async getRegistrationsByYear(year: 'I' | 'II' | 'III' | 'IV'): Promise<IRegistration[]> {
    try {
      const registrations = await Registration.find({ year }).sort({ createdAt: -1 });
      return registrations;
    } catch (error) {
      console.error('❌ Error fetching registrations by year:', error);
      throw error;
    }
  }

  async searchRegistrations(query: string): Promise<IRegistration[]> {
    try {
      const registrations = await Registration.find({
        $or: [
          { fullName: { $regex: query, $options: 'i' } },
          { secId: { $regex: query, $options: 'i' } },
          { phoneNumber: { $regex: query, $options: 'i' } }
        ]
      }).sort({ createdAt: -1 });
      
      return registrations;
    } catch (error) {
      console.error('❌ Error searching registrations:', error);
      throw error;
    }
  }

  async getRegistrationStats(): Promise<{
    total: number;
    pending: number;
    completed: number;
    failed: number;
    revenue: number;
  }> {
    try {
      const [total, pending, completed, failed] = await Promise.all([
        Registration.countDocuments(),
        Registration.countDocuments({ paymentStatus: 'pending' }),
        Registration.countDocuments({ paymentStatus: 'completed' }),
        Registration.countDocuments({ paymentStatus: 'failed' })
      ]);

      const revenue = completed * 300; // ₹300 per registration

      return {
        total,
        pending,
        completed,
        failed,
        revenue
      };
    } catch (error) {
      console.error('❌ Error fetching registration stats:', error);
      throw error;
    }
  }
}

export const mongoStorage = new MongoStorage(); 