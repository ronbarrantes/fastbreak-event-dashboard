type sports = [
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
];

export type Venue = {
  name: string;
  available: boolean;
};

export type SportEvent = {
  id: string;
  name: string;
  sportType: SportType;
  date: Date | null;
  description: string;
  venue?: Venue;
};

export type SportType = sports[number];
