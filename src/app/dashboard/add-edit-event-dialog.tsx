"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SportEvent } from "@/types/types";
import { tryCatch } from "@/utils/try-catch";

export function AddEditEventDialog({
  children,
  sportEvent,
}: {
  children: React.ReactNode;
  sportEvent?: SportEvent;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const dialogTitle = sportEvent ? "Edit event" : "Add event";

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
      </DialogContent>
    </Dialog>
  );
}
