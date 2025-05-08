import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSkateparkSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
