import { SportType } from "@/constants/sports";
import { VenueInsert } from "@/server/db/schema";

export type SportEvent = {
  id: string;
  name: string;
  sportType: SportType;
  startDate: Date | null;
  endDate: Date | null;
  description: string;
  venue?: VenueInsert;
};

export type { SportType };
