import { 
  users, type User, type InsertUser, 
  skateparks, type Skatepark, type InsertSkatepark,
  skateparkSubmissions, type SkateparkSubmission, type InsertSkateparkSubmission
} from "@shared/schema";
import { db } from "./db";
import { eq, like, or, and, inArray } from "drizzle-orm";

// Extended type with distance property for nearby parks
interface SkateparkWithDistance extends Skatepark {
  distance: number;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Skatepark methods
  getAllSkateparks(): Promise<Skatepark[]>;
  getSkateparkById(id: number): Promise<Skatepark | undefined>;
  getFreeSkateparks(): Promise<Skatepark[]>;
  getPaidSkateparks(): Promise<Skatepark[]>;
  getFeaturedSkateparks(): Promise<Skatepark[]>;
  createSkatepark(skatepark: InsertSkatepark): Promise<Skatepark>;
  searchSkateparks(query: string, state?: string, features?: string[]): Promise<Skatepark[]>;
  getNearbyParks(latitude: number, longitude: number, radiusInKm?: number): Promise<Skatepark[]>;
  
  // Skatepark submission methods
  getAllSkateparkSubmissions(): Promise<SkateparkSubmission[]>;
  getSkateparkSubmissionById(id: number): Promise<SkateparkSubmission | undefined>;
  createSkateparkSubmission(submission: InsertSkateparkSubmission): Promise<SkateparkSubmission>;
  updateSkateparkSubmissionStatus(id: number, status: string, reviewNotes?: string): Promise<SkateparkSubmission | undefined>;
  getPendingSkateparkSubmissions(): Promise<SkateparkSubmission[]>;
}

// This is the old in-memory storage class, kept for reference
// We're now using DatabaseStorage instead
export class MemStorage {
  private users: Map<number, User>;
  private skateparksMap: Map<number, Skatepark>;
  private currentUserId: number;
  private currentSkateparkId: number;

  constructor() {
    this.users = new Map();
    this.skateparksMap = new Map();
    this.currentUserId = 1;
    this.currentSkateparkId = 1;
    
    // Initialize with sample skateparks
    this.initializeSkateparks();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllSkateparks(): Promise<Skatepark[]> {
    return Array.from(this.skateparksMap.values());
  }

  async getSkateparkById(id: number): Promise<Skatepark | undefined> {
    return this.skateparksMap.get(id);
  }

  async getFreeSkateparks(): Promise<Skatepark[]> {
    return Array.from(this.skateparksMap.values()).filter(park => park.isFree);
  }

  async getPaidSkateparks(): Promise<Skatepark[]> {
    return Array.from(this.skateparksMap.values()).filter(park => !park.isFree);
  }

  async getFeaturedSkateparks(): Promise<Skatepark[]> {
    return Array.from(this.skateparksMap.values()).filter(park => park.isFeatured);
  }

  async createSkatepark(insertSkatepark: InsertSkatepark): Promise<Skatepark> {
    const id = this.currentSkateparkId++;
    const skatepark: Skatepark = { ...insertSkatepark, id };
    this.skateparksMap.set(id, skatepark);
    return skatepark;
  }

  async searchSkateparks(query: string, state?: string, features?: string[]): Promise<Skatepark[]> {
    let result = Array.from(this.skateparksMap.values());
    
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      result = result.filter(park => 
        park.name.toLowerCase().includes(lowercaseQuery) ||
        park.description.toLowerCase().includes(lowercaseQuery) ||
        park.city.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    if (state) {
      result = result.filter(park => park.state === state);
    }
    
    if (features && features.length > 0) {
      result = result.filter(park => 
        features.some(feature => park.features.includes(feature))
      );
    }
    
    return result;
  }
  
  private initializeSkateparks() {
    const initialSkateparks: InsertSkatepark[] = [
      {
        name: "Venice Beach Skatepark",
        description: "Legendary beachfront park with smooth concrete bowls, snake run, and street section. Perfect for all skill levels with amazing ocean views.",
        address: "1800 Ocean Front Walk",
        city: "Venice Beach",
        state: "California",
        imageUrl: "https://pixabay.com/get/gc1b8ebaa0cf1abfa9078fc20c0ec80220533a3c596dde8787ba92f3aba05213f0b4e82de03d55452702614fcbc25e5f6145bd24fa00880f2efd590e9255ae5b4_1280.jpg",
        isFree: true,
        price: null,
        rating: 45,
        features: ["Bowl", "Street", "Beginner-Friendly"],
        isFeatured: true
      },
      {
        name: "Vans Indoor Skatepark",
        description: "Pro-designed indoor facility with vert ramp, concrete pool, street course, and mini ramps. Climate controlled for year-round skating.",
        address: "12345 Main Street",
        city: "Orange County",
        state: "California",
        imageUrl: "https://images.unsplash.com/photo-1574007557239-acf6863bc375?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
        isFree: false,
        price: "$15/day",
        rating: 50,
        features: ["Vert", "Street", "Indoor"],
        isFeatured: true
      },
      {
        name: "Burnside Skatepark",
        description: "Legendary DIY park built by skaters under a bridge in the 90s. Rough, raw, and full of history with challenging transitions and a unique layout.",
        address: "SE 2nd Ave & Burnside St",
        city: "Portland",
        state: "Oregon",
        imageUrl: "https://pixabay.com/get/g4930947f2cb59ddb5d21583e15fdd61554504cec42b74335de93755e919e7e7f33382374219499f20aa6aca7dc2be48038f5de4ce652b105d6b501b22bd3e8f4_1280.jpg",
        isFree: true,
        price: null,
        rating: 40,
        features: ["Bowl", "Transition", "Advanced"],
        isFeatured: false
      },
      {
        name: "LES Coleman Skatepark",
        description: "Urban skate plaza under the Manhattan Bridge with smooth ledges, stairs, and rails. The beating heart of NYC street skating.",
        address: "62 Pike St",
        city: "New York City",
        state: "New York",
        imageUrl: "https://images.unsplash.com/photo-1583118443607-33f3731d09e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80",
        isFree: true,
        price: null,
        rating: 45,
        features: ["Street", "Urban", "All Levels"],
        isFeatured: false
      },
      {
        name: "Denver Skatepark",
        description: "Massive 60,000 sq ft park with spectacular mountain views. Features bowls, street sections, and flow elements for skaters of all abilities.",
        address: "2205 19th St",
        city: "Denver",
        state: "Colorado",
        imageUrl: "https://pixabay.com/get/gafb812657b08be206c6c5be67b9ad5b662e1c12801fc60d2972b3f31b1ca09fbd43a5c1b0cf74f3e71dd799e8c4e6947547f0bd284c698a760520fe966b7e36c_1280.jpg",
        isFree: true,
        price: null,
        rating: 50,
        features: ["Bowl", "Street", "All Levels"],
        isFeatured: false
      },
      {
        name: "Woodward West",
        description: "World-class action sports facility with indoor and outdoor parks, foam pits, and training areas. The ultimate skate camp experience.",
        address: "28400 Stallion Springs Dr",
        city: "Tehachapi",
        state: "California",
        imageUrl: "https://pixabay.com/get/gbf349701a050d54bf404884d00dc244e9acb73d22879678822b20da66973f19577f8294a44dad0649849bae31db2479fb5d3a321b46e3fcc737f67a778f1bec8_1280.jpg",
        isFree: false,
        price: "$60/day or $299/week",
        rating: 50,
        features: ["Indoor", "Outdoor", "Training"],
        isFeatured: false
      },
      {
        name: "The Berrics",
        description: "Iconic private skatepark founded by Steve Berra and Eric Koston. Street-focused layout that's hosted countless pro videos and contests.",
        address: "4621 Worth St",
        city: "Los Angeles",
        state: "California",
        imageUrl: "https://pixabay.com/get/g21d7ccc83b7442524c5061c90392ff21c55539f8a1ea12074951ce54d80b7539e45383a733833a870315762e7b062ce20cd5c376ff58456b46e2b393447246b6_1280.jpg",
        isFree: false,
        price: "$15/session",
        rating: 45,
        features: ["Street", "Indoor", "Pro"],
        isFeatured: false
      }
    ];
    
    initialSkateparks.forEach(park => {
      const id = this.currentSkateparkId++;
      const skatepark: Skatepark = { ...park, id };
      this.skateparksMap.set(id, skatepark);
    });
  }
}

// DatabaseStorage implementation using PostgreSQL
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Skatepark methods
  async getAllSkateparks(): Promise<Skatepark[]> {
    return await db.select().from(skateparks);
  }

  async getSkateparkById(id: number): Promise<Skatepark | undefined> {
    const result = await db.select().from(skateparks).where(eq(skateparks.id, id));
    return result[0];
  }

  async getFreeSkateparks(): Promise<Skatepark[]> {
    return await db.select().from(skateparks).where(eq(skateparks.isFree, true));
  }

  async getPaidSkateparks(): Promise<Skatepark[]> {
    return await db.select().from(skateparks).where(eq(skateparks.isFree, false));
  }

  async getFeaturedSkateparks(): Promise<Skatepark[]> {
    return await db.select().from(skateparks).where(eq(skateparks.isFeatured, true));
  }

  async createSkatepark(skatepark: InsertSkatepark): Promise<Skatepark> {
    const result = await db.insert(skateparks).values(skatepark).returning();
    return result[0];
  }

  async searchSkateparks(query: string, state?: string, features?: string[]): Promise<Skatepark[]> {
    let baseQuery = db.select().from(skateparks);
    const conditions = [];

    if (query) {
      conditions.push(
        or(
          like(skateparks.name, `%${query}%`),
          like(skateparks.description, `%${query}%`),
          like(skateparks.city, `%${query}%`)
        )
      );
    }

    if (state) {
      conditions.push(eq(skateparks.state, state));
    }

    // Apply the conditions if there are any
    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions));
    }

    // Execute the query
    const result = await baseQuery;
    
    // Filter by features if needed (done in-memory because array filtering in SQL is complex)
    if (features && features.length > 0) {
      return result.filter(park => 
        features.some(feature => park.features.includes(feature))
      );
    }

    return result;
  }
  
  async getNearbyParks(latitude: number, longitude: number, radiusInKm: number = 50): Promise<SkateparkWithDistance[]> {
    // Get all skateparks first
    const allParks = await this.getAllSkateparks();
    
    // Filter parks that have latitude and longitude
    const parksWithCoordinates = allParks.filter(
      park => park.latitude !== null && park.longitude !== null
    );
    
    // Calculate distance for each park with coordinates
    const parksWithDistance = parksWithCoordinates.map(park => {
      // Calculate distance using Haversine formula
      const distance = this.calculateDistance(
        latitude, 
        longitude, 
        park.latitude as number, 
        park.longitude as number
      );
      
      return { ...park, distance } as SkateparkWithDistance;
    });
    
    // Filter parks within the radius
    const nearbyParks = parksWithDistance
      .filter(park => park.distance <= radiusInKm)
      .sort((a, b) => a.distance - b.distance);
      
    return nearbyParks;
  }
  
  // Haversine formula to calculate distance between two points on Earth
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    
    return distance;
  }
  
  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Skatepark submission methods
  async getAllSkateparkSubmissions(): Promise<SkateparkSubmission[]> {
    return await db.select().from(skateparkSubmissions);
  }

  async getSkateparkSubmissionById(id: number): Promise<SkateparkSubmission | undefined> {
    const result = await db.select().from(skateparkSubmissions).where(eq(skateparkSubmissions.id, id));
    return result[0];
  }

  async createSkateparkSubmission(submission: InsertSkateparkSubmission): Promise<SkateparkSubmission> {
    const result = await db.insert(skateparkSubmissions).values(submission).returning();
    return result[0];
  }

  async updateSkateparkSubmissionStatus(id: number, status: string, reviewNotes?: string): Promise<SkateparkSubmission | undefined> {
    const updateData: any = { status };
    if (reviewNotes) {
      updateData.reviewNotes = reviewNotes;
    }

    const result = await db
      .update(skateparkSubmissions)
      .set(updateData)
      .where(eq(skateparkSubmissions.id, id))
      .returning();
    
    return result[0];
  }

  async getPendingSkateparkSubmissions(): Promise<SkateparkSubmission[]> {
    return await db
      .select()
      .from(skateparkSubmissions)
      .where(eq(skateparkSubmissions.status, "pending"));
  }
}

// Use DatabaseStorage
export const storage = new DatabaseStorage();
