import mongoose from 'mongoose';
import { Registration } from './models/Registration.js';

const MONGODB_URI = 'mongodb+srv://sairamMUN:sairam2027@cluster0.uqjjz91.mongodb.net/sairamMUN?retryWrites=true&w=majority&appName=Cluster0';

let isConnected = false;

export async function connectToMongoDB(): Promise<void> {
  if (isConnected) {
    console.log('✅ MongoDB already connected');
    return;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Database: sairamMUN');
    console.log('🌐 Cluster: Cluster0');
    
    // Test the connection by fetching all documents using the proper model
    const count = await Registration.countDocuments();
    console.log(`📈 Found ${count} existing registrations in the database`);
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Atlas:', error);
    throw error;
  }
}

export async function disconnectFromMongoDB(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('🔌 Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
}

export function getConnectionStatus(): boolean {
  return isConnected;
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  await disconnectFromMongoDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  await disconnectFromMongoDB();
  process.exit(0);
}); 