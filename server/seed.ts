import { db } from "./db";
import { skateparks } from "@shared/schema";
import { sql } from "drizzle-orm";

const initialSkateparks = [
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
    isFeatured: true,
    latitude: 33.985698,
    longitude: -118.473690
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
    isFeatured: true,
    latitude: 33.788281,
    longitude: -117.853340
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
    isFeatured: false,
    latitude: 45.523064,
    longitude: -122.663802
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
    isFeatured: false,
    latitude: 40.713348,
    longitude: -73.992052
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
    isFeatured: false,
    latitude: 39.752667,
    longitude: -105.005935
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
    isFeatured: false,
    latitude: 35.130442,
    longitude: -118.575226
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
    isFeatured: false,
    latitude: 34.043409,
    longitude: -118.217770
  }
];

/**
 * Seeds the database with initial skateparks
 */
export async function seedSkateparks() {
  try {
    // First check if there are any existing skateparks
    const result = await db.execute(sql`SELECT COUNT(*) FROM skateparks`);
    const count = parseInt(result.rows[0].count, 10);
    
    if (count === 0) {
      console.log("No skateparks found in database, seeding initial data...");
      
      // Insert skateparks
      for (const park of initialSkateparks) {
        await db.insert(skateparks).values({
          name: park.name,
          description: park.description,
          address: park.address,
          city: park.city,
          state: park.state,
          imageUrl: park.imageUrl,
          isFree: park.isFree,
          price: park.price,
          rating: park.rating,
          features: park.features,
          isFeatured: park.isFeatured,
          latitude: park.latitude,
          longitude: park.longitude
        });
      }
      
      console.log(`Successfully seeded ${initialSkateparks.length} skateparks`);
      return initialSkateparks;
    } else {
      console.log(`Database already has ${count} skateparks, skipping seed`);
      return null;
    }
  } catch (error) {
    console.error("Error seeding skateparks:", error);
    throw error;
  }
}