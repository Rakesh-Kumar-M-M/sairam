import type { Express } from "express";
import { createServer, type Server } from "http";
import { mongoStorage } from "./mongoStorage";
import { insertRegistrationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Registration endpoint
  app.post("/api/registrations", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const registration = await mongoStorage.createRegistration(validatedData);
      res.status(201).json({ 
        success: true, 
        message: "Registration successful",
        registration: {
          id: registration._id,
          fullName: registration.fullName,
          createdAt: registration.createdAt
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
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

  // MongoDB connection status endpoint
  app.get("/api/health", async (req, res) => {
    try {
      const stats = await mongoStorage.getRegistrationStats();
      res.json({ 
        success: true, 
        message: "Server is healthy",
        mongodb: "connected",
        stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Server health check failed",
        mongodb: "disconnected",
        error: error.message
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

  // Admin authentication endpoints
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Simple admin authentication (you can replace with database storage)
      if (username === "admin" && password === "sairammun2025") {
        res.json({ 
          success: true, 
          message: "Login successful",
          admin: { username: "admin" }
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

  // Change admin password
  app.post("/api/admin/change-password", async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      // Verify current password
      if (currentPassword !== "sairammun2025") {
        return res.status(401).json({ 
          success: false, 
          message: "Current password is incorrect" 
        });
      }
      
      // In a real application, you would update the password in the database
      // For now, we'll just return success (you can implement database storage)
      res.json({ 
        success: true, 
        message: "Password changed successfully",
        note: "In production, implement database storage for the new password"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to change password" 
      });
    }
  });

  // Send OTP for forgot password
  app.post("/api/admin/forgot-password", async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      // Verify the phone number matches the admin number
      if (phoneNumber !== "8838725153") {
        return res.status(400).json({ 
          success: false, 
          message: "Phone number not registered for admin access" 
        });
      }
      
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // In a real application, you would:
      // 1. Store the OTP in database with expiration
      // 2. Send SMS using a service like Twilio
      // 3. Implement rate limiting
      
      // For now, we'll just return the OTP (in production, send via SMS)
      res.json({ 
        success: true, 
        message: "OTP sent successfully",
        otp: otp, // Remove this in production - only for testing
        note: "In production, implement SMS service and remove OTP from response"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to send OTP" 
      });
    }
  });

  // Reset password with OTP
  app.post("/api/admin/reset-password", async (req, res) => {
    try {
      const { phoneNumber, otp, newPassword } = req.body;
      
      // Verify phone number
      if (phoneNumber !== "8838725153") {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid phone number" 
        });
      }
      
      // In a real application, you would:
      // 1. Verify OTP from database
      // 2. Check OTP expiration
      // 3. Update password in database
      
      // For now, we'll just return success (implement proper OTP verification)
      res.json({ 
        success: true, 
        message: "Password reset successfully",
        note: "In production, implement proper OTP verification and database storage"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to reset password" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
