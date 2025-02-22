"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";
import {
  Event,
  BillItem,
  EventDetails,
  Person,
  BillCategory,
  PaymentMethod,
  Report,
  Deductible,
} from "@/types/types";
import { getEvent } from "@/firebase/event";

interface EventStore {
  currentEvent: Event;
  currentStep: number;
  isLoading: boolean;
  isEditMode: boolean;
  error: string | null;

  initializeStore: (id: string, isEditMode: boolean) => void;
  setEventDetails: (details: EventDetails) => void;
  addParticipant: (person: Person) => void;
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, person: Person) => void;
  personIdtoName: (id: string) => string;
  addBillItem: (item: Omit<BillItem, "id">) => void;
  updateBillItem: (id: string, updates: Partial<Omit<BillItem, "id">>) => void;
  removeBillItem: (id: string) => void;
  calculateTotalPaid: (personId: string) => number;
  calculateTotalOwed: (personId: string) => number;
  deduct: (amount: number, reason: string) => void;
  updateReport: () => void;
  nextStep: () => void;
  previousStep: () => void;
  setStep: (step: number) => void;
  resetStore: () => void;
}

const initialReport: Report = {
  totalAmount: 0,
  deductible: {
    amount: 0,
    reason: "",
  },
  paidByPerson: {},
  owedByPerson: {},
  finalTotal: 0,
  finalOwedByPerson: {},
  netBalances: {},
};

const initialEvent: Event = {
  id: "",
  details: {
    eventTitle: "",
    location: "",
    coordinates: [27.7172, 85.324],
    date: new Date().toDateString(),
  },
  participants: [],
  items: [],
  report: initialReport,
};

export const useEventStore = create<EventStore>((set, get) => ({
  currentEvent: initialEvent,
  currentStep: 0,
  isEditMode: false,
  isLoading: false,
  error: null,

  setEventDetails: (details) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        details,
      },
    })),

  initializeStore: async (id: string, isEditMode: boolean) => {
    set({ isLoading: true, error: null });
    try {
      if (isEditMode) {
        const existingEvent = await getEvent(id);
        console.log("existingEvent", existingEvent);
        set({
          currentEvent: existingEvent,
          isEditMode: true,
          isLoading: false,
        });
      } else {
        set({
          currentEvent: {
            ...initialEvent,
            id: id,
          },
          isEditMode: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error initializing store:", error);
      set({ error: "Error initializing store", isLoading: false });
    }
  },

  addParticipant: (person) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        participants: [
          ...state.currentEvent.participants,
          {
            id: nanoid(),
            name: person.name,
            phone: person.phone,
            email: person.email,
          },
        ],
      },
    })),

  removeParticipant: (id) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        participants: state.currentEvent.participants.filter(
          (p) => p.id !== id
        ),
        items: state.currentEvent.items.map((item) => ({
          ...item,
          payments: item.payments.filter((p) => p.personId !== id),
          liablePersons: item.liablePersons.filter((p) => p !== id),
        })),
      },
    })),

  updateParticipant: (id, person) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        participants: state.currentEvent.participants.map((p) =>
          p.id === id ? { ...p, ...person } : p
        ),
      },
    })),

  personIdtoName: (id: string) => {
    const state = get();
    if (id === "common") return "Common";
    const person = state.currentEvent.participants.find((p) => p.id === id);
    return person ? person.name : "Unknown";
  },

  addBillItem: (item) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        items: [
          ...state.currentEvent.items,
          {
            ...item,
            id: nanoid(),
          },
        ],
      },
    })),

  updateBillItem: (id, updates) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        items: state.currentEvent.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      },
    })),

  removeBillItem: (id) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        items: state.currentEvent.items.filter((item) => item.id !== id),
      },
    })),

  calculateTotalPaid: (personId) => {
    const state = get();
    return state.currentEvent.items.reduce((total, item) => {
      const personPayments = item.payments
        .filter((payment) => payment.personId === personId)
        .reduce((sum, payment) => sum + payment.amount, 0);
      return total + personPayments;
    }, 0);
  },

  calculateTotalOwed: (personId) => {
    const state = get();
    return state.currentEvent.items.reduce((total, item) => {
      if (item.liablePersons.includes(personId)) {
        const liableAmount = item.amount / item.liablePersons.length;
        return total + liableAmount;
      }
      return total;
    }, 0);
  },

  deduct: (amount, reason) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        report: {
          ...state.currentEvent.report,
          deductible: {
            amount,
            reason,
          },
        },
      },
    })),

  updateReport: () => {
    const state = get();
    const participants = state.currentEvent.participants;
    const items = state.currentEvent.items;

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    // Calculate paid amounts per person
    const paidByPerson: { [personId: string]: number } = {};
    participants.forEach((person) => {
      paidByPerson[person.id] = state.calculateTotalPaid(person.id);
    });

    // Calculate owed amounts per person
    const owedByPerson: { [personId: string]: number } = {};
    participants.forEach((person) => {
      owedByPerson[person.id] = state.calculateTotalOwed(person.id);
    });

    // Calculate final total (after deductible)
    const finalTotal =
      totalAmount - state.currentEvent.report.deductible.amount;

    // Calculate final owed amounts per person (after deductible)
    const deductiblePerPerson =
      state.currentEvent.report.deductible.amount / participants.length;
    const finalOwedByPerson: { [personId: string]: number } = {};
    participants.forEach((person) => {
      finalOwedByPerson[person.id] =
        owedByPerson[person.id] - deductiblePerPerson;
    });

    // Calculate net balances (what each person needs to pay or receive)
    const netBalances: { [personId: string]: number } = {};
    participants.forEach((person) => {
      netBalances[person.id] =
        paidByPerson[person.id] - finalOwedByPerson[person.id];
    });

    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        report: {
          ...state.currentEvent.report,
          totalAmount,
          paidByPerson,
          owedByPerson,
          finalTotal,
          finalOwedByPerson,
          netBalances,
        },
      },
    }));
  },

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previousStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  setStep: (step) => set({ currentStep: step }),

  resetStore: () => set({ currentEvent: { ...initialEvent }, currentStep: -1 }),
}));
