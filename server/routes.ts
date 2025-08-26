import type { Express } from "express";
import { createServer, type Server } from "http";
import { mongoStorage } from "./mongoStorage";
import { insertRegistrationSchema } from "@shared/schema";
import { z } from "zod";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Ensure upload directory exists
  const uploadDir = path.join(__dirname, "..", "uploads", "screenshots");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only JPG and PNG images are allowed"));
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });

  // File upload endpoint
  app.post("/api/upload-screenshot", (req, res, next) => {
    upload.single("screenshot")(req, res, function (err) {
      if (err) {
        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ success: false, message: "File too large. Max size is 5MB." });
        }
        return res.status(400).json({ success: false, message: err.message || "Invalid file upload." });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
      const fileUrl = `/uploads/screenshots/${req.file.filename}`;
      res.json({ success: true, url: fileUrl });
    });
  });

  // Serve uploads as static files
  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

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
      
      // Create registration, payment status is handled in mongoStorage.createRegistration
      const registration = await mongoStorage.createRegistration({
        ...registrationData,
        paymentScreenshot: paymentScreenshot || undefined
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
      console.error('❌ Registration error:', error);
      
      // Check if it's a registration closed error
      if (error instanceof Error && error.message === 'Registration is currently closed') {
        res.status(403).json({
          success: false,
          message: 'Registration is currently closed',
          error: 'REGISTRATION_CLOSED'
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: "Failed to create registration",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get registration status endpoint
  app.get("/api/registration-status", async (req, res) => {
    try {
      const status = await mongoStorage.getRegistrationStatus();
      res.json({
        success: true,
        status
      });
    } catch (error) {
      console.error('❌ Error getting registration status:', error);
      res.status(500).json({
        success: false,
        message: "Failed to get registration status",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Update registration status endpoint (admin only)
  app.post("/api/registration-status", async (req, res) => {
    try {
      // Basic admin check - you might want to enhance this with proper authentication
      const { isOpen, message } = req.body;
      
      if (typeof isOpen !== 'boolean') {
        res.status(400).json({
          success: false,
          message: "isOpen must be a boolean"
        });
        return;
      }
      
      const status = await mongoStorage.updateRegistrationStatus({
        isOpen,
        message: message || undefined
      });
      
      res.json({
        success: true,
        message: `Registration ${isOpen ? 'opened' : 'closed'} successfully`,
        status
      });
    } catch (error) {
      console.error('❌ Error updating registration status:', error);
      res.status(500).json({
        success: false,
        message: "Failed to update registration status",
        error: error instanceof Error ? error.message : "Unknown error"
      });
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
      console.log('🔐 Admin login attempt:', {
        body: req.body,
        headers: req.headers,
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
      });

      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        console.log('❌ Admin login failed: Missing credentials');
        return res.status(400).json({ 
          success: false, 
          message: "Username and password are required" 
        });
      }
      
      // Simple authentication with fixed credentials
      if (username === "administration" && password === "SAIRAMMUN2025") {
        console.log('✅ Admin login successful:', { username, timestamp: new Date().toISOString() });
        res.json({ 
          success: true, 
          message: "Login successful",
          admin: { username }
        });
      } else {
        console.log('❌ Admin login failed: Invalid credentials', { username });
        res.status(401).json({ 
          success: false, 
          message: "Invalid credentials" 
        });
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Login failed",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
