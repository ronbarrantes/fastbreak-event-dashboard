"use client";

import { useDialogStore } from "@/state/dialog-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export const ModalDialog = () => {
  const { isOpen, title, dialogContent, handleDialogClose, showDialogOutline } =
    useDialogStore();

  if (!dialogContent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent
        className="border-slate-700 bg-slate-900/95 backdrop-blur"
        showCloseButton={showDialogOutline}
      >
        {title && (
          <DialogHeader>
            <DialogTitle className="text-white">{title}</DialogTitle>
          </DialogHeader>
        )}
        <DialogDescription asChild={typeof dialogContent !== "string"}>
          {dialogContent}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
