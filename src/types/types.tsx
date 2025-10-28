export const SPORTS = [
  "soccer",
  "basketball",
  "baseball",
  "football",
  "rugby",
  "cricket",
  "tennis",
  "table tennis",
  "badminton",
  "squash",
  "volleyball",
  "beach volleyball",
  "handball",
  "field hockey",
  "ice hockey",
  "golf",
  "boxing",
  "wrestling",
  "swimming",
  "diving",
  "water polo",
  "rowing",
  "mountain biking",
  "triathlon",
  "gymnastics",
  "surfing",
] as const;

export type Venue = {
  name: string;
  available: boolean;
  description?: string;
  capacity?: number;
  amenities?: string;
};

export type SportEvent = {
  id: string;
  name: string;
  sportType: SportType;
  date: Date | null;
  description: string;
  venue?: Venue;
};

export type SportType = (typeof SPORTS)[number];

export type VenueOption = {
  id: string;
  name: string;
};
