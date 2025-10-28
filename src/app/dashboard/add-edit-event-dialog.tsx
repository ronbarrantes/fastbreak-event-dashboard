"use client";
import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { SPORTS, SportEvent, SportType, VenueOption } from "@/types/types";

const eventFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  sportType: z.custom<SportType>((val) => typeof val === "string" && (SPORTS as readonly string[]).includes(val), {
    message: "Select a valid sport type.",
  }),
  startDate: z
    .string()
    .min(1, { message: "Start date is required." })
    .refine((v) => !Number.isNaN(Date.parse(v)), { message: "Invalid start date/time." }),
  endDate: z
    .string()
    .min(1, { message: "End date is required." })
    .refine((v) => !Number.isNaN(Date.parse(v)), { message: "Invalid end date/time." }),
  description: z.string().min(2, { message: "Description must be at least 2 characters." }),
  venueId: z.string().uuid({ message: "Select a venue." }),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

function toLocalDateTimeInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export const AddEditEventDialog = ({
  children,
  sportEvent,
  venues,
}: {
  children: React.ReactNode;
  sportEvent?: SportEvent;
  venues: VenueOption[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultDateString = useMemo(() => toLocalDateTimeInputValue(new Date()), []);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: sportEvent?.name ?? "",
      sportType: (sportEvent?.sportType as SportType) ?? ("soccer" as SportType),
      startDate: sportEvent?.date ? toLocalDateTimeInputValue(new Date(sportEvent.date)) : defaultDateString,
      endDate: sportEvent?.date ? toLocalDateTimeInputValue(new Date(sportEvent.date)) : defaultDateString,
      description: sportEvent?.description ?? "",
      venueId: "",
    },
  });

  const dialogTitle = sportEvent ? "Edit event" : "Add event";

  const onSubmit = (values: EventFormValues) => {
    // Wire up to your API/server action here
    // This keeps the UI and validation fully functional.
    // Example payload shape expected by the DB layer
    const payload = {
      eventName: values.name,
      sportType: values.sportType,
      description: values.description,
      startDate: new Date(values.startDate),
      endDate: new Date(values.endDate),
      venueId: values.venueId,
    };
    // eslint-disable-next-line no-console
    console.log("submit event payload", payload);
    setIsOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>Fill in the event details below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event name</FormLabel>
                  <FormControl>
                    <Input placeholder="Event name" {...field} />
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
                  <FormLabel>Sport type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                    >
                      {(SPORTS as readonly string[]).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
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
                    <FormLabel>End date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Short description" {...field} />
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
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
                    >
                      <option value="" disabled>
                        Select a venue
                      </option>
                      {venues.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Save</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
