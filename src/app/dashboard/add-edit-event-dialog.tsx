"use client";
import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { ChevronDownIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  .refine((data) => dayjs(data.endDate).isAfter(dayjs(data.startDate)), {
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
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDateSelected, setStartDateSelected] = useState<Date | undefined>(
    undefined
  );
  const [endDateSelected, setEndDateSelected] = useState<Date | undefined>(
    undefined
  );
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const router = useRouter();

  // Get current time rounded to nearest 15 minutes
  const getCurrentTime15Min = useCallback(() => {
    const now = dayjs();
    const minutes = now.minute();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    const time = now.minute(roundedMinutes).second(0).millisecond(0);
    return time.format("HH:mm");
  }, []);

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

  // Combine date and time into a datetime string
  const combineDateTime = useCallback(
    (date: Date | undefined, time: string): string => {
      if (!date || !time) return "";
      const [hours, minutes] = time.split(":");
      return dayjs(date)
        .hour(parseInt(hours, 10))
        .minute(parseInt(minutes, 10))
        .second(0)
        .millisecond(0)
        .toISOString();
    },
    []
  );

  // Get datetime string for form submission
  const getStartDateTime = useCallback((): string => {
    return combineDateTime(startDateSelected, startTime);
  }, [combineDateTime, startDateSelected, startTime]);

  const getEndDateTime = useCallback((): string => {
    return combineDateTime(endDateSelected, endTime);
  }, [combineDateTime, endDateSelected, endTime]);

  useEffect(() => {
    const loadVenues = async () => {
      const venuesData = await getVenues();
      setVenues(venuesData);
    };
    if (isOpen) {
      loadVenues();
    }
  }, [isOpen]);

  // Sync date/time values to form for validation
  useEffect(() => {
    const startDateTime = getStartDateTime();
    form.setValue("startDate", startDateTime);
  }, [startDateSelected, startTime, getStartDateTime, form]);

  useEffect(() => {
    const endDateTime = getEndDateTime();
    form.setValue("endDate", endDateTime);
  }, [endDateSelected, endTime, getEndDateTime, form]);

  // Clear end date if start date changes and becomes after end date
  useEffect(() => {
    if (
      startDateSelected &&
      endDateSelected &&
      dayjs(endDateSelected).isBefore(dayjs(startDateSelected), "day")
    ) {
      setEndDateSelected(undefined);
      setEndTime("11:00");
    }
  }, [startDateSelected, endDateSelected]);

  // Adjust start time to current time if in the past when today is selected
  useEffect(() => {
    if (startDateSelected && dayjs(startDateSelected).isSame(dayjs(), "day")) {
      const currentTime = getCurrentTime15Min();
      const [currentH, currentM] = currentTime.split(":");
      const [startH, startM] = startTime.split(":");
      const currentTotalMin = parseInt(currentH) * 60 + parseInt(currentM);
      const startTotalMin = parseInt(startH) * 60 + parseInt(startM);
      if (startTotalMin < currentTotalMin) {
        setStartTime(currentTime);
      }
    }
  }, [startDateSelected, startTime, getCurrentTime15Min]);

  // Adjust end time to be after start time when on same day
  useEffect(() => {
    if (
      startDateSelected &&
      endDateSelected &&
      dayjs(endDateSelected).isSame(dayjs(startDateSelected), "day")
    ) {
      const [startH, startM] = startTime.split(":");
      const [endH, endM] = endTime.split(":");
      const startTotalMin = parseInt(startH) * 60 + parseInt(startM);
      const endTotalMin = parseInt(endH) * 60 + parseInt(endM);
      if (endTotalMin <= startTotalMin) {
        // Add 15 minutes to start time to ensure end time is after
        const adjustedTotalMin = startTotalMin + 15;
        // Clamp to 23:45 to stay within the same day (avoid 00:00 wrap-around)
        const clampedTotalMin = Math.min(adjustedTotalMin, 1425);
        const adjustedHours = Math.floor(clampedTotalMin / 60);
        const adjustedMins = clampedTotalMin % 60;
        const newEndTime = `${String(adjustedHours).padStart(2, "0")}:${String(adjustedMins).padStart(2, "0")}`;
        // Only update if the new value is different to avoid infinite loops
        if (newEndTime !== endTime) {
          setEndTime(newEndTime);
        }
      }
    }
  }, [startDateSelected, startTime, endDateSelected, endTime]);

  const dialogTitle = sportEvent ? "Edit event" : "Add event";

  const handleSubmit = async (values: z.infer<typeof eventSchema>) => {
    setIsLoading(true);
    try {
      const startDateTime = getStartDateTime();
      const endDateTime = getEndDateTime();

      await createEvent(
        {
          eventName: values.eventName,
          sportType: values.sportType,
          description: values.description,
          venueId: values.venueId,
          startDate: dayjs(startDateTime).toDate(),
          endDate: dayjs(endDateTime).toDate(),
        },
        { revalidate: "/dashboard" }
      );
      toast.success("Event created successfully!");
      setIsOpen(false);
      form.reset();
      setStartDateSelected(undefined);
      setEndDateSelected(undefined);
      setStartTime("10:00");
      setEndTime("11:00");
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
                render={() => (
                  <FormItem>
                    <FormLabel className="text-white">Start Date</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-3">
                        <Popover
                          open={startDateOpen}
                          onOpenChange={setStartDateOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between border-slate-700 bg-slate-800/50 font-normal text-white"
                            >
                              {startDateSelected
                                ? startDateSelected.toLocaleDateString()
                                : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden border-slate-700 bg-slate-900 p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={startDateSelected}
                              captionLayout="dropdown"
                              disabled={(date) =>
                                dayjs(date).isBefore(dayjs(), "day")
                              }
                              onSelect={(date) => {
                                setStartDateSelected(date);
                                setStartDateOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="border-slate-700 bg-slate-800/50 text-white"
                          step="900"
                          min={
                            startDateSelected &&
                            dayjs(startDateSelected).isSame(dayjs(), "day")
                              ? getCurrentTime15Min()
                              : undefined
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-white">End Date</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-3">
                        <Popover
                          open={endDateOpen}
                          onOpenChange={setEndDateOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between border-slate-700 bg-slate-800/50 font-normal text-white"
                            >
                              {endDateSelected
                                ? endDateSelected.toLocaleDateString()
                                : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden border-slate-700 bg-slate-900 p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={endDateSelected}
                              captionLayout="dropdown"
                              disabled={(date) =>
                                startDateSelected
                                  ? date < startDateSelected
                                  : false
                              }
                              onSelect={(date) => {
                                setEndDateSelected(date);
                                setEndDateOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="border-slate-700 bg-slate-800/50 text-white"
                          step="900"
                          min={
                            startDateSelected &&
                            endDateSelected &&
                            dayjs(endDateSelected).isSame(
                              dayjs(startDateSelected),
                              "day"
                            )
                              ? startTime
                              : undefined
                          }
                        />
                      </div>
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
