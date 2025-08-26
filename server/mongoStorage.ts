import { Registration } from "./models/Registration";
import { RegistrationStatusModel } from "./models/RegistrationStatus";
import { IRegistration, InsertRegistration, RegistrationStatus } from "@shared/schema";

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
  migrateCommitteeField(): Promise<{ updatedCount: number; totalCount: number }>;
  getRegistrationStatus(): Promise<RegistrationStatus>;
  updateRegistrationStatus(status: Partial<RegistrationStatus>): Promise<RegistrationStatus>;
}

export class MongoStorage implements IMongoStorage {
  async createRegistration(registrationData: InsertRegistration): Promise<IRegistration> {
    try {
      // Check if registration is open before allowing creation
      const status = await this.getRegistrationStatus();
      if (!status.isOpen) {
        throw new Error('Registration is currently closed');
      }

      console.log('📝 Creating registration with data:', registrationData);
      
      // Extract payment screenshot and determine payment status
      const { paymentScreenshot, ...otherData } = registrationData;
      const paymentStatus = paymentScreenshot ? 'completed' : 'pending';
      
      const registration = new Registration({
        ...otherData,
        paymentScreenshot: paymentScreenshot || undefined,
        paymentStatus,
        createdAt: new Date()
      });
      
      console.log('📝 Registration model created:', registration);
      
      const savedRegistration = await registration.save();
      console.log(`✅ Created new registration: ${savedRegistration.fullName} (ID: ${savedRegistration._id}) with payment status: ${savedRegistration.paymentStatus}`);
      return savedRegistration;
    } catch (error) {
      console.error('❌ Error creating registration:', {
        error: error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : 'No stack trace',
        errorName: error instanceof Error ? error.name : 'Unknown error type',
        registrationData: registrationData
      });
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

  async migrateCommitteeField(): Promise<{ updatedCount: number; totalCount: number }> {
    try {
      // Find all registrations that don't have a committee field
      const registrationsWithoutCommittee = await Registration.find({ committee: { $exists: false } });
      const totalCount = await Registration.countDocuments();
      
      if (registrationsWithoutCommittee.length === 0) {
        console.log('✅ All registrations already have committee field');
        return { updatedCount: 0, totalCount };
      }

      // Update all registrations without committee field to have a default value
      const result = await Registration.updateMany(
        { committee: { $exists: false } },
        { $set: { committee: 'UNEP' } } // Default to UNEP
      );

      console.log(`✅ Migrated ${result.modifiedCount} registrations to include committee field`);
      return { updatedCount: result.modifiedCount, totalCount };
    } catch (error) {
      console.error('❌ Error migrating committee field:', error);
      throw error;
    }
  }

  async getRegistrationStatus(): Promise<RegistrationStatus> {
    try {
      let status = await RegistrationStatusModel.findOne();
      
      if (!status) {
        // Create default status if none exists
        status = await RegistrationStatusModel.create({
          isOpen: true,
          message: null,
          closedAt: null
        });
      }
      
      return {
        isOpen: status.isOpen,
        message: status.message || undefined,
        closedAt: status.closedAt || undefined
      };
    } catch (error) {
      console.error('❌ Error getting registration status:', error);
      // Return default open status if there's an error
      return {
        isOpen: true,
        message: undefined,
        closedAt: undefined
      };
    }
  }

  async updateRegistrationStatus(status: Partial<RegistrationStatus>): Promise<RegistrationStatus> {
    try {
      let currentStatus = await RegistrationStatusModel.findOne();
      
      if (!currentStatus) {
        // Create new status if none exists
        currentStatus = await RegistrationStatusModel.create({
          isOpen: true,
          message: null,
          closedAt: null
        });
      }
      
      // Update the status
      const updatedStatus = await RegistrationStatusModel.findByIdAndUpdate(
        currentStatus._id,
        {
          ...status,
          closedAt: status.isOpen === false ? new Date() : undefined
        },
        { new: true }
      );
      
      if (!updatedStatus) {
        throw new Error('Failed to update registration status');
      }
      
      return {
        isOpen: updatedStatus.isOpen,
        message: updatedStatus.message || undefined,
        closedAt: updatedStatus.closedAt || undefined
      };
    } catch (error) {
      console.error('❌ Error updating registration status:', error);
      throw error;
    }
  }
}

export const mongoStorage = new MongoStorage(); 