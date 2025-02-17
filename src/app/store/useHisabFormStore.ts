// formStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { BillSummary, Item, Person } from "@/types/hisab";

interface FormState {
  currentStep: number;
  location: Location | null;
  people: Person[];
  items: Item[];
  summary: BillSummary | null;

  // Actions
  setLocation: (location: Location) => void;
  addPerson: (name: string) => void;
  removePerson: (id: string) => void;
  addItem: (item: Omit<Item, "id">) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  removeItem: (id: string) => void;
  calculateSummary: () => void;
  setStep: (step: number) => void;
  reset: () => void;
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      location: null,
      people: [],
      items: [],
      summary: null,

      setLocation: (location) => set({ location }),

      addPerson: (name) =>
        set((state) => ({
          people: [...state.people, { id: uuidv4(), name }],
        })),

      removePerson: (id) =>
        set((state) => ({
          people: state.people.filter((person) => person.id !== id),
        })),

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, id: uuidv4() }],
        })),

      updateItem: (id, updatedItem) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updatedItem } : item
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      calculateSummary: () => {
        const state = get();

        const summary: BillSummary = {
          totalAmount: state.items.reduce(
            (sum, item) => sum + item.totalCost,
            0
          ),
          perPersonBreakdown: [],
        };
        set({ summary });
      },

      setStep: (step) => set({ currentStep: step }),

      reset: () =>
        set({
          currentStep: 0,
          location: null,
          people: [],
          items: [],
          summary: null,
        }),
    }),
    {
      name: "bill-split-storage",
    }
  )
);
