import { create } from "zustand";
import { Timestamp } from "firebase/firestore";
import {
  Location,
  Person,
  Item,
  BillSummary,
  PersonalDetails,
  Player,
} from "@/types/hisab";

// Define the state structure
interface AppState {
  players: Player[];
  addPlayer: (player: Player) => void;
  updatePlayer: (uid: string, updates: Partial<Player>) => void;

  locations: Location[];
  addLocation: (location: Location) => void;

  items: Item[];
  addItem: (item: Item) => void;
  updateItem: (itemId: string, updates: Partial<Item>) => void;
  deleteItem: (itemId: string) => void;

  billSummary: BillSummary | null;
  calculateBillSummary: () => void;

  getPlayerById: (uid: string) => Player | undefined;
  getItemById: (itemId: string) => Item | undefined;
}
// Create the Zustand store
export const useStore = create<AppState>((set, get) => ({
  players: [],
  locations: [],
  items: [],
  billSummary: null,

  // Actions

  // Players
  addPlayer: (player) =>
    set((state) => ({ players: [...state.players, player] })),
  updatePlayer: (uid, updates) =>
    set((state) => ({
      players: state.players.map((player) =>
        player.uid === uid ? { ...player, ...updates } : player
      ),
    })),

  // Locations
  addLocation: (location) =>
    set((state) => ({ locations: [...state.locations, location] })),

  // Items
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (itemId, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    })),
  deleteItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    })),

  // Bill Summary
  calculateBillSummary: () => {
    const { items, players } = get();

    const perPersonBreakdown = players.map((player) => {
      const paid = items
        .filter((item) =>
          item.contributions.some(
            (contribution) => contribution.personId === player.uid
          )
        )
        .reduce((sum, item) => sum + item.totalCost, 0);

      const shouldPay = items
        .filter((item) =>
          item.splits.some(
            (split) => split.personId === player.uid && split.shouldPay
          )
        )
        .reduce((sum, item) => sum + item.totalCost, 0);

      const netAmount = paid - shouldPay;

      return {
        personId: player.uid,
        paid,
        shouldPay,
        netAmount,
      };
    });

    const totalAmount = perPersonBreakdown.reduce(
      (sum, breakdown) => sum + breakdown.paid,
      0
    );

    set({ billSummary: { totalAmount, perPersonBreakdown } });
  },

  // Utility functions
  getPlayerById: (uid) => get().players.find((player) => player.uid === uid),
  getItemById: (itemId) => get().items.find((item) => item.id === itemId),
}));
