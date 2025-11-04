"use client";
import { useEffect, useState } from "react";

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
import { useDateTimePicker } from "@/hooks/calendar";
import { createEvent } from "@/lib/actions/events";
import { getVenues } from "@/lib/actions/venues";
import { SportEvent } from "@/types/types";
import { tryCatch } from "@/utils/try-catch";

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
  const router = useRouter();

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventName: sportEvent?.name ?? "",
      sportType: sportEvent?.sportType ?? "",
      description: sportEvent?.description ?? "",
      venueId: sportEvent?.venue?.id ?? "",
      startDate: sportEvent?.startDate
        ? dayjs(sportEvent.startDate).format("YYYY-MM-DD")
        : "",
      endDate: sportEvent?.endDate
        ? dayjs(sportEvent.endDate).format("YYYY-MM-DD")
        : "",
    },
  });

  // Use the date/time picker hook
  const cal = useDateTimePicker<z.infer<typeof eventSchema>>({ form });

  useEffect(() => {
    const loadVenues = async () => {
      const venuesData = await getVenues();
      setVenues(venuesData);
    };
    if (isOpen) {
      loadVenues();
    }
  }, [isOpen]);

  const dialogTitle = sportEvent ? "Edit event" : "Add event";

  const handleSubmit = async (values: z.infer<typeof eventSchema>) => {
    setIsLoading(true);

    const startDateTime = cal.getStartDateTime();
    const endDateTime = cal.getEndDateTime();

    const result = await tryCatch(
      createEvent(
        {
          eventName: values.eventName,
          sportType: values.sportType,
          description: values.description,
          venueId: values.venueId,
          startDate: dayjs(startDateTime).toDate(),
          endDate: dayjs(endDateTime).toDate(),
        },
        { revalidate: "/dashboard" }
      )
    );

    if (result.error) {
      toast.error(
        result.error instanceof Error
          ? result.error.message
          : "Failed to create event"
      );
    } else {
      toast.success("Event created successfully!");
      setIsOpen(false);
      form.reset();
      cal.reset();
      router.refresh();
    }

    setIsLoading(false);
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
                          open={cal.startDateOpen}
                          onOpenChange={cal.setStartDateOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between border-slate-700 bg-slate-800/50 font-normal text-white"
                            >
                              {cal.startDateSelected
                                ? cal.startDateSelected.toLocaleDateString()
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
                              selected={cal.startDateSelected}
                              defaultMonth={
                                cal.startDateSelected || cal.getToday()
                              }
                              captionLayout="dropdown"
                              disabled={cal.isStartDateDisabled}
                              onSelect={(date) => {
                                cal.setStartDateSelected(date);
                                cal.setStartDateOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <Input
                          type="time"
                          value={cal.startTime}
                          onChange={(e) => cal.setStartTime(e.target.value)}
                          className="border-slate-700 bg-slate-800/50 text-white"
                          step="900"
                          min={cal.getMinStartTime()}
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
                          open={cal.endDateOpen}
                          onOpenChange={cal.setEndDateOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between border-slate-700 bg-slate-800/50 font-normal text-white"
                            >
                              {cal.endDateSelected
                                ? cal.endDateSelected.toLocaleDateString()
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
                              selected={cal.endDateSelected}
                              defaultMonth={
                                cal.endDateSelected ||
                                cal.startDateSelected ||
                                cal.getToday()
                              }
                              captionLayout="dropdown"
                              disabled={cal.isEndDateDisabled}
                              onSelect={(date) => {
                                cal.setEndDateSelected(date);
                                cal.setEndDateOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <Input
                          type="time"
                          value={cal.endTime}
                          onChange={(e) => cal.setEndTime(e.target.value)}
                          className="border-slate-700 bg-slate-800/50 text-white"
                          step="900"
                          min={cal.getMinEndTime()}
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
