import type { Express } from "express";
import { createServer, type Server } from "http";
import { mongoStorage } from "./mongoStorage";
import { insertRegistrationSchema } from "@shared/schema";
import { z } from "zod";
import mongoose from "mongoose";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint with detailed MongoDB status
  app.get("/api/health", async (req, res) => {
    try {
      const mongoStatus = mongoose.connection.readyState;
      const mongoStatusText = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }[mongoStatus] || 'unknown';

      console.log('🏥 Health check requested:', {
        mongoStatus,
        mongoStatusText,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: "Server is healthy",
        mongoDB: {
          status: mongoStatusText,
          connected: mongoStatus === 1
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Health check failed:', error);
      res.status(500).json({
        success: false,
        message: "Health check failed",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Registration endpoint
  app.post("/api/registrations", async (req, res) => {
    try {
      console.log('📝 Registration request received:', {
        body: req.body,
        headers: req.headers,
        method: req.method,
        url: req.url
      });

      const validatedData = insertRegistrationSchema.parse(req.body);
      console.log('✅ Data validated successfully:', validatedData);

      // Extract payment screenshot if provided
      const { paymentScreenshot, ...registrationData } = validatedData;
      
      // Create registration with payment screenshot and set status to completed if screenshot provided
      const registration = await mongoStorage.createRegistration({
        ...registrationData,
        paymentScreenshot: paymentScreenshot || undefined,
        paymentStatus: paymentScreenshot ? 'completed' : 'pending'
      });
      
      console.log('✅ Registration created successfully:', registration._id);

      res.status(201).json({ 
        success: true, 
        message: "Registration successful",
        registration: {
          id: registration._id,
          fullName: registration.fullName,
          createdAt: registration.createdAt,
          paymentStatus: registration.paymentStatus
        }
      });
    } catch (error) {
      console.error('❌ Registration error details:', {
        error: error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : 'No stack trace',
        errorName: error instanceof Error ? error.name : 'Unknown error type'
      });

      if (error instanceof z.ZodError) {
        console.error('❌ Validation error:', error.errors);
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        console.error('❌ Internal server error:', error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error",
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }
  });

  // Get all registrations (admin endpoint)
  app.get("/api/registrations", async (req, res) => {
    try {
      const registrations = await mongoStorage.getAllRegistrations();
      res.json({ success: true, registrations });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch registrations" 
      });
    }
  });

  // Get registration by ID
  app.get("/api/registrations/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const registration = await mongoStorage.getRegistration(id);
      if (!registration) {
        res.status(404).json({ 
          success: false, 
          message: "Registration not found" 
        });
        return;
      }
      res.json({ success: true, registration });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch registration" 
      });
    }
  });

  // Get registration statistics
  app.get("/api/registrations/stats", async (req, res) => {
    try {
      const stats = await mongoStorage.getRegistrationStats();
      res.json({ success: true, stats });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch statistics" 
      });
    }
  });

  // Search registrations
  app.get("/api/registrations/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const registrations = await mongoStorage.searchRegistrations(query);
      res.json({ success: true, registrations });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to search registrations" 
      });
    }
  });

  // Update payment status
  app.patch("/api/registrations/:id/payment", async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      
      if (!['pending', 'completed', 'failed'].includes(status)) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid payment status" 
        });
        return;
      }

      const registration = await mongoStorage.updatePaymentStatus(id, status);
      if (!registration) {
        res.status(404).json({ 
          success: false, 
          message: "Registration not found" 
        });
        return;
      }
      
      res.json({ success: true, registration });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to update payment status" 
      });
    }
  });

  // Update payment status for a registration
  app.patch("/api/registrations/:id/payment-status", async (req, res) => {
    try {
      const id = req.params.id;
      const { paymentStatus } = req.body;
      if (!['pending', 'completed', 'failed'].includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment status"
        });
      }
      const updated = await mongoStorage.updatePaymentStatus(id, paymentStatus);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Registration not found"
        });
      }
      res.json({ success: true, registration: updated });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update payment status"
      });
    }
  });

  // Test MongoDB connection endpoint
  app.get("/api/test-mongodb", async (req, res) => {
    try {
      // Test creating a document
      const testRegistration = await mongoStorage.createRegistration({
        fullName: "Test Connection",
        year: "I",
        department: "Test Department",
        section: "T",
        secId: "TEST123",
        college: "Test College",
        preferredCountry: "Test Country",
        phoneNumber: "1234567890"
      });

      // Test reading documents
      const allRegistrations = await mongoStorage.getAllRegistrations();
      
      // Test deleting the test document
      await mongoStorage.deleteRegistration(testRegistration._id.toString());

      res.json({
        success: true,
        message: "MongoDB connection test successful",
        testCreated: testRegistration.fullName,
        totalDocuments: allRegistrations.length,
        testDeleted: true
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "MongoDB connection test failed",
        error: error.message
      });
    }
  });

  // Admin authentication endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Simple authentication with fixed credentials
      if (username === "administration" && password === "SAIRAMMUN2025") {
        res.json({ 
          success: true, 
          message: "Login successful",
          admin: { username }
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: "Invalid credentials" 
        });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Login failed" 
      });
    }
  });

  // Migration endpoint to add committee field to existing registrations
  app.post("/api/migrate/committee", async (req, res) => {
    try {
      const result = await mongoStorage.migrateCommitteeField();
      res.json({
        success: true,
        message: "Migration completed successfully",
        updatedCount: result.updatedCount,
        totalCount: result.totalCount
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Migration failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
