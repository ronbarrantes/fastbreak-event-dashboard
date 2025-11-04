import { create } from "zustand";

type DialogProps = {
  content: React.ReactNode;
  title?: string;
  showDialogOutline?: boolean;
};

type DialogState = {
  isOpen: boolean;
  title: string;
  setIsOpen: () => void;
  showDialogOutline: boolean;
  dialogContent: React.ReactNode | string;
  handleDialog: (props: DialogProps) => void;
  handleDialogClose: () => void;
};

export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  title: "",
  showDialogOutline: false,
  setIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  dialogContent: null,
  handleDialog: (props) =>
    set({
      dialogContent: props.content,
      isOpen: true,
      title: props.title,
      showDialogOutline: props.showDialogOutline,
    }),
  handleDialogClose: () =>
    set({ dialogContent: null, isOpen: false, title: "" }),
}));
