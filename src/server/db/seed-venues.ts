import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { venue } from "./schema";

config({ path: ".env.local" });

const venues = [
  // High School Football Fields
  {
    name: "Lincoln High School Stadium",
    description: "A classic high school football field with natural grass and traditional bleacher seating. Perfect for local games and community events.",
    capacity: 5000,
    amenities: "Parking, Concessions, Restrooms, Press Box",
  },
  {
    name: "Riverside Community Field",
    description: "Modern high school facility with synthetic turf and updated lighting. Home to multiple local teams and community gatherings.",
    capacity: 7500,
    amenities: "Parking, Concessions, Restrooms, Scoreboard, Lighting",
  },
  {
    name: "Memorial Stadium",
    description: "Historic high school stadium with a rich tradition. Features natural grass field and covered seating areas.",
    capacity: 8500,
    amenities: "Parking, Concessions, Restrooms, Covered Seating, Press Box",
  },

  // College/Community Stadiums
  {
    name: "State University Football Stadium",
    description: "Mid-size college football stadium with excellent sightlines and modern facilities. Ideal for college-level competitions.",
    capacity: 25000,
    amenities: "Parking, Premium Seating, Concessions, Restrooms, Press Box, Jumbotron, VIP Suites",
  },
  {
    name: "Community College Arena",
    description: "Versatile multi-purpose venue hosting football, soccer, and track events. Features a state-of-the-art track surrounding the field.",
    capacity: 15000,
    amenities: "Parking, Concessions, Restrooms, Track, Press Box, Lighting",
  },

  // Basketball Arenas
  {
    name: "Metro Basketball Arena",
    description: "Professional-grade basketball arena with retractable seating and premium amenities. Hosts major league games and tournaments.",
    capacity: 18000,
    amenities: "Parking, Premium Seating, Luxury Suites, Concessions, Restrooms, Jumbotron, Locker Rooms, Media Center",
  },
  {
    name: "City Sports Complex",
    description: "Modern multi-purpose arena perfect for basketball, volleyball, and indoor sports. Features a hardwood court and excellent acoustics.",
    capacity: 12000,
    amenities: "Parking, Concessions, Restrooms, Locker Rooms, Scoreboard, Sound System",
  },
  {
    name: "Downtown Arena",
    description: "State-of-the-art basketball facility in the heart of the city. Known for its intimate atmosphere and great viewing angles.",
    capacity: 16000,
    amenities: "Parking, Premium Seating, Concessions, Restrooms, Jumbotron, VIP Lounges, Media Center",
  },

  // Baseball Parks
  {
    name: "Riverfront Ballpark",
    description: "Beautiful minor league baseball park with stunning views of the river. Classic ballpark atmosphere with modern amenities.",
    capacity: 12000,
    amenities: "Parking, Concessions, Restrooms, Covered Seating, Press Box, Scoreboard, Dugout Suites",
  },
  {
    name: "Heritage Baseball Stadium",
    description: "Historic baseball stadium that has been modernized while maintaining its classic charm. Perfect for professional and college games.",
    capacity: 18000,
    amenities: "Parking, Premium Seating, Concessions, Restrooms, Press Box, Luxury Suites, Jumbotron",
  },
  {
    name: "Sunset Park",
    description: "Intimate baseball park with excellent sightlines and a family-friendly atmosphere. Features natural grass and classic architecture.",
    capacity: 8000,
    amenities: "Parking, Concessions, Restrooms, Covered Seating, Press Box, Kids Zone",
  },

  // Large Arenas/Stadiums
  {
    name: "National Sports Complex",
    description: "Massive multi-purpose stadium capable of hosting major league events, concerts, and large-scale competitions. World-class facilities throughout.",
    capacity: 65000,
    amenities: "Parking, Premium Seating, Luxury Suites, Concessions, Restrooms, Jumbotron, Press Box, Media Center, VIP Lounges, Club Seating",
  },
  {
    name: "Championship Arena",
    description: "Elite-level arena designed for hosting championship events and major tournaments. Features cutting-edge technology and premium amenities.",
    capacity: 22000,
    amenities: "Parking, Premium Seating, Luxury Suites, Concessions, Restrooms, Jumbotron, Press Box, Media Center, VIP Lounges, Club Seating, Locker Rooms",
  },
  {
    name: "Olympic Stadium",
    description: "International-standard stadium built for major sporting events. Can accommodate multiple sports and large crowds with world-class facilities.",
    capacity: 50000,
    amenities: "Parking, Premium Seating, Luxury Suites, Concessions, Restrooms, Jumbotron, Press Box, Media Center, VIP Lounges, Club Seating, Training Facilities",
  },
  {
    name: "The Grand Arena",
    description: "Premier sports and entertainment venue featuring the latest in technology and design. Hosts everything from major sports to concerts.",
    capacity: 28000,
    amenities: "Parking, Premium Seating, Luxury Suites, Concessions, Restrooms, Jumbotron, Press Box, Media Center, VIP Lounges, Club Seating, Restaurants, Bars",
  },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const client = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  console.log("🌱 Starting to seed venues...");

  try {
    // Check if venues already exist
    const existingVenues = await db.select().from(venue).limit(1);

    if (existingVenues.length > 0) {
      console.log("⚠️  Venues already exist in the database.");
      console.log("   If you want to re-seed, please clear the venues table first.");
      process.exit(0);
    }

    // Insert venues
    const insertedVenues = await db.insert(venue).values(venues).returning();

    console.log(`✅ Successfully seeded ${insertedVenues.length} venues!`);
    console.log("\nVenues created:");
    insertedVenues.forEach((v, index) => {
      console.log(`  ${index + 1}. ${v.name} (Capacity: ${v.capacity.toLocaleString()})`);
    });
  } catch (error) {
    console.error("❌ Error seeding venues:", error);
    throw error;
  } finally {
    await client.end();
  }
}

seed()
  .then(() => {
    console.log("\n✨ Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seeding failed:", error);
    process.exit(1);
  });

