import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { event, venue, type VenuesRow } from "./schema";

config({ path: ".env.local" });

// Helper function to add hours to a date
function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

// Helper function to add days to a date
function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

// Helper function to get a random date in the future (within next 6 months)
function getRandomFutureDate(): Date {
  const now = new Date();
  const daysAhead = Math.floor(Math.random() * 180); // 0-180 days
  const hours = Math.floor(Math.random() * 24); // 0-23 hours
  return addHours(addDays(now, daysAhead), hours);
}

// Helper function to get a random date in the past (within last 3 months)
function getRandomPastDate(): Date {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 90); // 0-90 days
  const hours = Math.floor(Math.random() * 24); // 0-23 hours
  return addHours(addDays(now, -daysAgo), hours);
}

async function seedEvents() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  if (!process.env.ADMIN_ID) {
    throw new Error(
      "ADMIN_ID environment variable is not set. Please set it in .env.local"
    );
  }

  const adminId = process.env.ADMIN_ID;
  const client = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  console.log("🌱 Starting to seed events...");

  try {
    // Fetch all venues from the database
    const venues = await db.select().from(venue);

    if (venues.length === 0) {
      throw new Error(
        "No venues found in database. Please run 'npm run db:seed' first to seed venues."
      );
    }

    console.log(`📋 Found ${venues.length} venues in database`);

    // Categorize venues by type
    const footballVenues = venues.filter(
      (v) =>
        v.name.toLowerCase().includes("stadium") ||
        v.name.toLowerCase().includes("field") ||
        v.name.toLowerCase().includes("football")
    );
    const basketballVenues = venues.filter(
      (v) =>
        v.name.toLowerCase().includes("arena") ||
        v.name.toLowerCase().includes("basketball")
    );
    const baseballVenues = venues.filter(
      (v) =>
        v.name.toLowerCase().includes("ballpark") ||
        v.name.toLowerCase().includes("baseball") ||
        v.name.toLowerCase().includes("park")
    );
    const otherVenues = venues.filter(
      (v) =>
        !footballVenues.includes(v) &&
        !basketballVenues.includes(v) &&
        !baseballVenues.includes(v)
    );

    // Helper to get a random venue from a category
    const getRandomVenue = (category: VenuesRow[]): VenuesRow => {
      if (category.length === 0)
        return venues[Math.floor(Math.random() * venues.length)];
      return category[Math.floor(Math.random() * category.length)];
    };

    // Event templates - will be matched with appropriate venues
    const eventTemplates = [
      // Football Events
      {
        eventName: "Championship Football Game",
        sportType: "football",
        description:
          "High-stakes championship match featuring top teams. Don't miss this exciting showdown!",
        price: "45.00",
        venueCategory: footballVenues,
        durationHours: 3,
      },
      {
        eventName: "Friday Night Lights - High School Football",
        sportType: "football",
        description:
          "Classic high school football rivalry game. Experience the excitement of local competition.",
        price: "15.00",
        venueCategory: footballVenues,
        durationHours: 2.5,
      },
      {
        eventName: "College Football Rivalry",
        sportType: "football",
        description:
          "Intense college football rivalry game. Historic matchup between long-time competitors.",
        price: "65.00",
        venueCategory: footballVenues,
        durationHours: 3.5,
      },
      {
        eventName: "Professional Football League",
        sportType: "football",
        description:
          "Professional league match featuring elite athletes. Premium football experience.",
        price: "85.00",
        venueCategory: footballVenues,
        durationHours: 3,
      },

      // Basketball Events
      {
        eventName: "NBA Championship Finals",
        sportType: "basketball",
        description:
          "The ultimate basketball showdown. Watch the best players compete for the championship title.",
        price: "150.00",
        venueCategory: basketballVenues,
        durationHours: 2.5,
      },
      {
        eventName: "College Basketball Tournament",
        sportType: "basketball",
        description:
          "March Madness tournament game. High-energy college basketball action.",
        price: "55.00",
        venueCategory: basketballVenues,
        durationHours: 2,
      },
      {
        eventName: "Streetball Championship",
        sportType: "basketball",
        description:
          "Urban basketball tournament featuring the best streetball players. Fast-paced, high-energy action.",
        price: "25.00",
        venueCategory: basketballVenues,
        durationHours: 3,
      },
      {
        eventName: "Women's Basketball League",
        sportType: "basketball",
        description:
          "Professional women's basketball league game. Support elite female athletes.",
        price: "40.00",
        venueCategory: basketballVenues,
        durationHours: 2,
      },

      // Baseball Events
      {
        eventName: "Opening Day Baseball",
        sportType: "baseball",
        description:
          "The start of the baseball season! Come celebrate opening day with America's pastime.",
        price: "50.00",
        venueCategory: baseballVenues,
        durationHours: 3.5,
      },
      {
        eventName: "Minor League Baseball",
        sportType: "baseball",
        description:
          "Minor league baseball game featuring up-and-coming talent. Family-friendly atmosphere.",
        price: "20.00",
        venueCategory: baseballVenues,
        durationHours: 3,
      },
      {
        eventName: "Playoff Baseball Series",
        sportType: "baseball",
        description:
          "Critical playoff game. Watch teams battle for a spot in the championship series.",
        price: "75.00",
        venueCategory: baseballVenues,
        durationHours: 3.5,
      },

      // Soccer Events
      {
        eventName: "International Soccer Match",
        sportType: "soccer",
        description:
          "International friendly match featuring top national teams. Experience world-class soccer.",
        price: "60.00",
        venueCategory: footballVenues,
        durationHours: 2,
      },
      {
        eventName: "Youth Soccer Championship",
        sportType: "soccer",
        description:
          "Youth soccer championship finals. Watch the next generation of soccer stars compete.",
        price: "12.00",
        venueCategory: footballVenues,
        durationHours: 2,
      },
      {
        eventName: "Professional Soccer League",
        sportType: "soccer",
        description:
          "Professional soccer league match. High-level competition and exciting gameplay.",
        price: "45.00",
        venueCategory: footballVenues,
        durationHours: 2,
      },

      // Tennis Events
      {
        eventName: "Tennis Championship Tournament",
        sportType: "tennis",
        description:
          "Professional tennis tournament featuring world-ranked players. Witness incredible serves and rallies.",
        price: "80.00",
        venueCategory: otherVenues,
        durationHours: 4,
      },

      // Volleyball Events
      {
        eventName: "Beach Volleyball Tournament",
        sportType: "beach volleyball",
        description:
          "Professional beach volleyball tournament. Sun, sand, and world-class athletes.",
        price: "35.00",
        venueCategory: otherVenues,
        durationHours: 3,
      },
      {
        eventName: "Indoor Volleyball Championship",
        sportType: "volleyball",
        description:
          "Indoor volleyball championship match. Fast-paced action and incredible athleticism.",
        price: "30.00",
        venueCategory: basketballVenues,
        durationHours: 2,
      },

      // Ice Hockey Events
      {
        eventName: "Ice Hockey Playoffs",
        sportType: "ice hockey",
        description:
          "Playoff ice hockey game. Fast-paced action on ice with intense competition.",
        price: "70.00",
        venueCategory: otherVenues,
        durationHours: 2.5,
      },

      // Boxing Events
      {
        eventName: "Championship Boxing Match",
        sportType: "boxing",
        description:
          "World championship boxing match. Watch elite fighters compete for the title.",
        price: "120.00",
        venueCategory: otherVenues,
        durationHours: 3,
      },

      // Rugby Events
      {
        eventName: "Rugby Championship",
        sportType: "rugby",
        description:
          "Rugby championship match. High-intensity action and physical competition.",
        price: "50.00",
        venueCategory: footballVenues,
        durationHours: 2,
      },
    ];

    // Check if events already exist
    const existingEvents = await db.select().from(event).limit(1);

    if (existingEvents.length > 0) {
      console.log("⚠️  Events already exist in the database.");
      console.log(
        "   If you want to re-seed, please clear the events table first."
      );
      process.exit(0);
    }

    // Generate events (mix of past and future)
    const events = eventTemplates.map((template, index) => {
      const selectedVenue = getRandomVenue(template.venueCategory);
      const isPast = index % 3 === 0; // Every 3rd event is in the past
      const startDate = isPast ? getRandomPastDate() : getRandomFutureDate();
      const endDate = addHours(startDate, template.durationHours);

      return {
        userId: adminId,
        venueId: selectedVenue.id,
        eventName: template.eventName,
        sportType: template.sportType,
        description: template.description,
        price: template.price,
        startDate,
        endDate,
      };
    });

    // Insert events
    const insertedEvents = await db.insert(event).values(events).returning();

    console.log(`✅ Successfully seeded ${insertedEvents.length} events!`);
    console.log("\nEvents created:");
    insertedEvents.forEach((e, index) => {
      const venueName =
        venues.find((v) => v.id === e.venueId)?.name || "Unknown Venue";
      const dateStr = new Date(e.startDate).toLocaleDateString();
      const isPast = new Date(e.startDate) < new Date();
      const status = isPast ? "Past" : "Upcoming";
      console.log(
        `  ${index + 1}. ${e.eventName} (${e.sportType}) - ${venueName} - ${dateStr} [${status}]`
      );
    });
  } catch (error) {
    console.error("❌ Error seeding events:", error);
    throw error;
  } finally {
    await client.end();
  }
}

seedEvents()
  .then(() => {
    console.log("\n✨ Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seeding failed:", error);
    process.exit(1);
  });
