import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

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
    persist(
      (set) => ({
        viewType: "table",
        setViewType: (viewType) => set({ viewType }),
      }),
      {
        name: "view-preference-storage",
      }
    ),
    { name: "VIEW_STORE" }
  )
);
