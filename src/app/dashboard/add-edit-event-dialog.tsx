"use client";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sports } from "@/constants/sports";
import { createEvent } from "@/lib/actions/events";
import { getVenues } from "@/lib/actions/venues";
import { SportEvent } from "@/types/types";

const eventSchema = z
  .object({
    eventName: z.string().min(2, {
      message: "Event name must be at least 2 characters.",
    }),
    sportType: z.string().min(1, {
      message: "Sport type is required.",
    }),
    description: z.string().min(2, {
      message: "Description must be at least 2 characters.",
    }),
    venueId: z.uuid({
      message: "Please select a venue.",
    }),
    startDate: z.string().min(1, {
      message: "Start date is required.",
    }),
    endDate: z.string().min(1, {
      message: "End date is required.",
    }),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date.",
    path: ["endDate"],
  });

type Venue = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  amenities: string | null;
};

export const AddEditEventDialog = ({
  children,
  sportEvent,
}: {
  children: React.ReactNode;
  sportEvent?: SportEvent;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadVenues = async () => {
      const venuesData = await getVenues();
      setVenues(venuesData);
    };
    if (isOpen) {
      loadVenues();
    }
  }, [isOpen]);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventName: sportEvent?.name ?? "",
      sportType: sportEvent?.sportType ?? "",
      description: sportEvent?.description ?? "",
      venueId: "",
      startDate: "",
      endDate: "",
    },
  });

  // Round datetime to nearest 15-minute interval
  const roundTo15Minutes = (dateString: string): string => {
    if (!dateString) return dateString;
    const date = new Date(dateString);
    const minutes = date.getMinutes();
    const roundedMinutes = Math.round(minutes / 15) * 15;
    date.setMinutes(roundedMinutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const roundedMins = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${roundedMins}`;
  };

  // Get current datetime in format for datetime-local input (YYYY-MM-DDTHH:mm)
  // Rounds to nearest 15-minute interval
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(Math.floor(now.getMinutes() / 15) * 15).padStart(
      2,
      "0"
    );
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const startDate = form.watch("startDate");

  const dialogTitle = sportEvent ? "Edit event" : "Add event";

  const handleSubmit = async (values: z.infer<typeof eventSchema>) => {
    setIsLoading(true);
    try {
      await createEvent(
        {
          eventName: values.eventName,
          sportType: values.sportType,
          description: values.description,
          venueId: values.venueId,
          startDate: new Date(values.startDate),
          endDate: new Date(values.endDate),
        },
        { revalidate: "/dashboard" }
      );
      toast.success("Event created successfully!");
      setIsOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create event"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-slate-700 bg-slate-900/95 backdrop-blur">
        <DialogHeader>
          <DialogTitle className="text-white">{dialogTitle}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {sportEvent
              ? "Update the event details below."
              : "Fill in the details to create a new event."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Event Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-slate-700 bg-slate-800/50 text-white"
                      placeholder="Enter event name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Sport Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="ring-offset-background flex h-10 w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select sport type</option>
                      {sports.map((sport) => (
                        <option key={sport} value={sport}>
                          {sport}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Venue</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="ring-offset-background flex h-10 w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a venue</option>
                      {venues.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="border-slate-700 bg-slate-800/50 text-white"
                      placeholder="Enter event description"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Start Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        min={getCurrentDateTime()}
                        step={900}
                        className="border-slate-700 bg-slate-800/50 text-white"
                        onChange={(e) => {
                          const rounded = roundTo15Minutes(e.target.value);
                          field.onChange(rounded);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">End Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        min={startDate || getCurrentDateTime()}
                        step={900}
                        className="border-slate-700 bg-slate-800/50 text-white"
                        onChange={(e) => {
                          const rounded = roundTo15Minutes(e.target.value);
                          field.onChange(rounded);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-slate-700 text-white hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-cyan-500 text-white hover:bg-cyan-600"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
