CREATE TABLE "fastbreakai_dash_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"venueId" uuid NOT NULL,
	"eventName" text NOT NULL,
	"sportType" text NOT NULL,
	"description" text NOT NULL,
	"startDate" timestamp with time zone NOT NULL,
	"endDate" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fastbreakai_dash_tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"eventId" uuid NOT NULL,
	"userId" uuid,
	"price" numeric(10, 2) NOT NULL,
	"type" text DEFAULT 'general',
	"status" text DEFAULT 'available',
	"issuedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fastbreakai_dash_venues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"capacity" integer DEFAULT 0 NOT NULL,
	"amenities" text,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fastbreakai_dash_events" ADD CONSTRAINT "fastbreakai_dash_events_venueId_fastbreakai_dash_venues_id_fk" FOREIGN KEY ("venueId") REFERENCES "public"."fastbreakai_dash_venues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fastbreakai_dash_tickets" ADD CONSTRAINT "fastbreakai_dash_tickets_eventId_fastbreakai_dash_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."fastbreakai_dash_events"("id") ON DELETE cascade ON UPDATE no action;