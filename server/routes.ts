import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSkateparkSchema, insertSkateparkSubmissionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for skateparks
  app.get("/api/skateparks", async (req, res) => {
    try {
      const parks = await storage.getAllSkateparks();
      res.json(parks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch skateparks" });
    }
  });

  app.get("/api/skateparks/featured", async (req, res) => {
    try {
      const featuredParks = await storage.getFeaturedSkateparks();
      res.json(featuredParks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured skateparks" });
    }
  });

  app.get("/api/skateparks/free", async (req, res) => {
    try {
      const freeParks = await storage.getFreeSkateparks();
      res.json(freeParks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch free skateparks" });
    }
  });

  app.get("/api/skateparks/paid", async (req, res) => {
    try {
      const paidParks = await storage.getPaidSkateparks();
      res.json(paidParks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch paid skateparks" });
    }
  });

  app.get("/api/skateparks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const park = await storage.getSkateparkById(id);
      if (!park) {
        return res.status(404).json({ message: "Skatepark not found" });
      }
      
      res.json(park);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch skatepark details" });
    }
  });

  app.post("/api/skateparks", async (req, res) => {
    try {
      const parseResult = insertSkateparkSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid skatepark data", 
          errors: parseResult.error.errors 
        });
      }
      
      const newPark = await storage.createSkatepark(parseResult.data);
      res.status(201).json(newPark);
    } catch (error) {
      res.status(500).json({ message: "Failed to create skatepark" });
    }
  });

  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const state = req.query.state as string;
      const features = req.query.features ? (req.query.features as string).split(',') : undefined;
      
      const results = await storage.searchSkateparks(query, state, features);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  app.get("/api/skateparks/nearby", async (req, res) => {
    try {
      const { lat, lng, radius } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      
      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);
      const radiusInKm = radius ? parseFloat(radius as string) : 50; // Default 50km
      
      if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusInKm)) {
        return res.status(400).json({ message: "Invalid coordinates or radius" });
      }
      
      const nearbyParks = await storage.getNearbyParks(latitude, longitude, radiusInKm);
      res.json(nearbyParks);
    } catch (error) {
      console.error("Error finding nearby skateparks:", error);
      res.status(500).json({ message: "Failed to find nearby skateparks" });
    }
  });

  // Skatepark submissions API endpoints
  app.post("/api/submit-skatepark", async (req, res) => {
    try {
      const parseResult = insertSkateparkSubmissionSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid skatepark submission data", 
          errors: parseResult.error.errors 
        });
      }
      
      const newSubmission = await storage.createSkateparkSubmission(parseResult.data);
      res.status(201).json({
        message: "Skatepark submission received successfully! We'll review it soon.",
        submissionId: newSubmission.id
      });
    } catch (error) {
      console.error("Submission error:", error);
      res.status(500).json({ message: "Failed to submit skatepark" });
    }
  });

  // Admin routes for managing submissions
  app.get("/api/admin/submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllSkateparkSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  app.get("/api/admin/submissions/pending", async (req, res) => {
    try {
      const pendingSubmissions = await storage.getPendingSkateparkSubmissions();
      res.json(pendingSubmissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending submissions" });
    }
  });

  app.get("/api/admin/submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const submission = await storage.getSkateparkSubmissionById(id);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submission details" });
    }
  });

  app.patch("/api/admin/submissions/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const { status, reviewNotes } = req.body;
      if (!status || !["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedSubmission = await storage.updateSkateparkSubmissionStatus(id, status, reviewNotes);
      if (!updatedSubmission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      
      // If approved, create a new skatepark
      if (status === "approved") {
        const newSkateparkData = {
          name: updatedSubmission.name,
          description: updatedSubmission.description,
          address: updatedSubmission.address,
          city: updatedSubmission.city,
          state: updatedSubmission.state,
          imageUrl: updatedSubmission.imageUrl || "https://pixabay.com/get/gc1b8ebaa0cf1abfa9078fc20c0ec80220533a3c596dde8787ba92f3aba05213f0b4e82de03d55452702614fcbc25e5f6145bd24fa00880f2efd590e9255ae5b4_1280.jpg",
          isFree: updatedSubmission.isFree,
          price: updatedSubmission.price || null,
          rating: 0, // Initial rating
          features: updatedSubmission.features || [],
          isFeatured: false, // New parks are not featured by default
        };
        
        await storage.createSkatepark(newSkateparkData);
      }
      
      res.json({
        message: `Submission ${status}`,
        submission: updatedSubmission
      });
    } catch (error) {
      console.error("Status update error:", error);
      res.status(500).json({ message: "Failed to update submission status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
