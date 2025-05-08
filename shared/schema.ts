import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define the skatepark schema
export const skateparks = pgTable("skateparks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  imageUrl: text("imageUrl").notNull(),
  isFree: boolean("isFree").notNull().default(true),
  price: text("price"),
  rating: integer("rating").notNull().default(0),
  features: text("features").array().notNull(),
  isFeatured: boolean("isFeatured").default(false),
});

export const insertSkateparkSchema = createInsertSchema(skateparks).omit({
  id: true,
});

export type InsertSkatepark = z.infer<typeof insertSkateparkSchema>;
export type Skatepark = typeof skateparks.$inferSelect;
