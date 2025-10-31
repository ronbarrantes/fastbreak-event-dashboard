import { SportType } from "@/constants/sports";

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
