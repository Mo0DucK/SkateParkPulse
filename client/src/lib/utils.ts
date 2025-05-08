import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format rating as stars (e.g. 45 -> 4.5)
export function formatRating(rating: number): string {
  return (rating / 10).toFixed(1);
}

// States for dropdown
export const STATES = [
  "All States", 
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
  "New Hampshire", "New Jersey", "New Mexico", "New York", 
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
  "West Virginia", "Wisconsin", "Wyoming"
];

// Park features for filtering
export const PARK_FEATURES = [
  "All Types",
  "Bowl",
  "Street",
  "Vert",
  "Indoor",
  "Outdoor",
  "Transition",
  "Pool",
  "Beginner-Friendly",
  "Advanced",
  "All Levels",
  "Training"
];
