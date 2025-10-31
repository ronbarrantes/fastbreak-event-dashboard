import { create } from "zustand";
import { devtools } from "zustand/middleware";

type ViewType = "grid" | "table";

type ViewState = {
  viewType: ViewType;
};

type ViewActions = {
  setViewType: (viewType: ViewType) => void;
};

export type ViewStore = ViewActions & ViewState;

export const useViewStore = create<ViewStore>()(
  devtools(
    (set) => ({
      viewType: "table",
      setViewType: (viewType) => set({ viewType }),
    }),
    { name: "VIEW_STORE" }
  )
);

