import {
  InferInsertModel,
  InferSelectModel,
  relations,
  sql,
} from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const createTable = pgTableCreator((name) => `fastbreakai_dash_${name}`);

export const event = createTable("events", (d) => ({
  id: d.uuid().defaultRandom().primaryKey(),
  userId: d.uuid().notNull(),
  venueId: d
    .uuid()
    .notNull()
    .references(() => venue.id, { onDelete: "cascade" }),
  eventName: d.text().notNull(),
  sportType: d.text().notNull(),
  description: d.text().notNull(),
  startDate: d.timestamp({ withTimezone: true }).notNull(),
  endDate: d.timestamp({ withTimezone: true }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const venue = createTable("venues", (d) => ({
  id: d.uuid().defaultRandom().primaryKey(),
  name: d.text().notNull(),
  description: d.text().notNull(),
  capacity: d.integer().notNull().default(0),
  amenities: d.text(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const ticket = createTable("tickets", (d) => ({
  id: d.uuid().defaultRandom().primaryKey(),
  eventId: d
    .uuid()
    .notNull()
    .references(() => event.id, { onDelete: "cascade" }),
  userId: d.uuid(),
  price: d.numeric({ precision: 10, scale: 2 }).notNull(),
  type: d.text().default("general"),
  status: d.text().default("available"),
  issuedAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const eventRelations = relations(event, ({ one, many }) => ({
  venue: one(venue, { fields: [event.venueId], references: [venue.id] }),
  tickets: many(ticket),
}));

export type EventInsert = InferInsertModel<typeof event>;
export type VenueInsert = InferInsertModel<typeof venue>;
export type TicketInsert = InferInsertModel<typeof ticket>;

export type EventsRow = InferSelectModel<typeof event>;
export type VenuesRow = InferSelectModel<typeof venue>;
