"use client";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
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
import { SportEvent } from "@/types/types";
import { tryCatch } from "@/utils/try-catch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const eventSchema = z.object({
  title: z.string().min(2, {
    message: "Title least 2 characters.",
  }),

  desc: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),

  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),

  sportType: z.string(),

  date: z.date().nullish(),

  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),

  venue: z.object({
    name: z.string(),
    id: z.uuid(),
  }),
});

export const AddEditEventDialog = ({
  children,
  sportEvent,
}: {
  children: React.ReactNode;
  sportEvent?: SportEvent;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: sportEvent?.name ?? "",
      sportType: sportEvent?.sportType ?? "",
      date: sportEvent?.date ?? "",
      description: sportEvent?.description ?? "",
      venue: sportEvent?.venue ?? null,
    },
  });

  const dialogTitle = sportEvent ? "Edit event" : "Add event";

  const handleSubmit = () => {};

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will delet the Now Item with
            title of:
          </DialogDescription>
          <DialogDescription className="font-semibold">
            Add or edit event
          </DialogDescription>
        </DialogHeader>
        <Button
          type="button"
          variant="destructive"
          onClick={async () => {
            const { error } = await tryCatch();
            // api.now.delete.mutateAsync(item.id)

            if (error) {
              setIsOpen(true);
              return;
            }
            setIsOpen(false);
          }}
        ></Button>
        <DialogClose asChild>
          <Button type="button">Close</Button>
        </DialogClose>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col space-y-8"
          >
            {id ? (
              <DialogHeader>
                <DialogTitle>Update the now item</SheetTitle>
                <DialogDescription>What is your update:</SheetDescription>
              </DialogHeader>
            ) : (
              <DialogHeader>
                <DialogTitle>Add a now item</SheetTitle>
                <DialogDescription>
                  What am you up to right now:
                </DialogDescription>
              </DialogHeader>
            )}
            <div className="flex flex-1 auto-rows-min flex-col gap-6 px-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Save changes</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
