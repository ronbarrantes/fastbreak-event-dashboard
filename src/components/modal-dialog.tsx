import { AiOutlineClose } from "react-icons/ai";

import { useDialogStore } from "@/state/dialog-store";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";

export const ModalDialog = () => {
  const { isOpen, title, dialogContent, handleDialogClose } = useDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <div className="relative max-h-[calc(100vh-80px)] rounded-md border border-slate-300 bg-white p-6">
        <DialogClose
          asChild
          className="absolute top-[-12px] right-[-12px] flex h-8 w-8 rounded-full bg-slate-950 p-1.5 text-2xl text-white shadow-2xl hover:bg-slate-200 hover:text-slate-950"
        >
          <AiOutlineClose size={15} />
        </DialogClose>
        <div className="flex flex-col justify-between gap-3">
          {title?.length && (
            <DialogTitle className="text-2xl font-semibold text-slate-950">
              {title}
            </DialogTitle>
          )}
          <DialogDescription asChild={typeof dialogContent !== "string"}>
            {dialogContent}
          </DialogDescription>
        </div>
      </div>
    </Dialog>
  );
};
