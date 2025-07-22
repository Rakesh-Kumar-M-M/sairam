import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Registration endpoint
  app.post("/api/registrations", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.createRegistration(validatedData);
      res.status(201).json({ 
        success: true, 
        message: "Registration successful",
        registration: {
          id: registration.id,
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
      const registrations = await storage.getAllRegistrations();
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
      const id = parseInt(req.params.id);
      const registration = await storage.getRegistration(id);
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

  const httpServer = createServer(app);
  return httpServer;
}
