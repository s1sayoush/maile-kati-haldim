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
  SettlementTransaction,
} from "@/types/types";
import { getEvent } from "@/firebase/event";

interface EventStore {
  currentEvent: Event;
  currentStep: number;
  isLoading: boolean;
  isEditMode: boolean;
  error: string | null;

  initializeStore: (id?: string, isEditMode?: boolean) => void;
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
  deduct: (deductible: Deductible) => void;
  calculateReport: () => void;
  calculateSettlementPlan: () => void;
  nextStep: () => void;
  previousStep: () => void;
  setStep: (step: number) => void;
  resetStore: () => void;
}

const initialReport: Report = {
  totalAmount: 0,
  deductible: {
    reason: "",
    isApplied: false,
  },
  paidByPerson: {},
  owedByPerson: {},
  finalTotal: 0,
  finalOwedByPerson: {},
  netBalances: {},
};

const initialEvent: Event = {
  id: nanoid(),
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

  initializeStore: async (id?: string, isEditMode?: boolean) => {
    set({ isLoading: true, error: null });
    try {
      if (isEditMode) {
        const existingEvent = await getEvent(id as string);
        console.log("existingEvent", existingEvent);
        set({
          currentEvent: existingEvent,
          isEditMode: true,
          isLoading: false,
        });
      } else {
        set({
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

  deduct: (deductible: Deductible) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        report: {
          ...state.currentEvent.report,
          deductible: {
            ...deductible,
          },
        },
      },
    })),

  calculateReport: () => {
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
      totalAmount - state.currentEvent.report.deductible.amount!;

    // Calculate deductible per person
    const deductiblePerPerson =
      state.currentEvent.report.deductible.amount! / participants.length;

    // Calculate final owed amounts per person (after deductible)
    const finalOwedByPerson: { [personId: string]: number } = {};
    participants.forEach((person) => {
      finalOwedByPerson[person.id] =
        owedByPerson[person.id] - deductiblePerPerson;
    });

    // Calculate net balances (what each person needs to pay or receive)
    const netBalances: { [personId: string]: number } = {};

    // Adjust paid amounts proportionally for deductible
    const totalPaid = Object.values(paidByPerson).reduce(
      (sum, amount) => sum + amount,
      0
    );
    participants.forEach((person) => {
      // Calculate how much of the deductible this person should get back based on their contribution
      const deductibleShare =
        totalPaid > 0
          ? (paidByPerson[person.id] / totalPaid) *
            state.currentEvent.report.deductible.amount!
          : 0;

      // Net balance is: (what they paid - their share of deductible) - what they owe
      netBalances[person.id] =
        paidByPerson[person.id] -
        deductibleShare -
        finalOwedByPerson[person.id];
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
  calculateSettlementPlan: () => {
    const state = get();
    const netBalances = state.currentEvent.report.netBalances;

    // Separate participants into creditors and debtors.
    const creditors: { id: string; amount: number }[] = [];
    const debtors: { id: string; amount: number }[] = [];

    Object.entries(netBalances!).forEach(([personId, balance]) => {
      // Allow a small threshold to avoid rounding issues.
      if (balance > 0.01) {
        creditors.push({ id: personId, amount: balance });
      } else if (balance < -0.01) {
        // Store the debt as a positive number.
        debtors.push({ id: personId, amount: -balance });
      }
    });

    // Sort both arrays (largest amounts first)
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const transactions: SettlementTransaction[] = [];
    let creditorIndex = 0;
    let debtorIndex = 0;

    // Greedy settlement: match the largest debtor with the largest creditor.
    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex];
      const debtor = debtors[debtorIndex];

      // Determine the settlement amount as the smaller of the two amounts.
      const settleAmount = Math.min(creditor.amount, debtor.amount);

      transactions.push({
        from: debtor.id,
        to: creditor.id,
        amount: Number(settleAmount.toFixed(2)),
      });

      // Adjust the amounts after settlement.
      creditor.amount -= settleAmount;
      debtor.amount -= settleAmount;

      // Move to the next creditor if this one is fully settled.
      if (Math.abs(creditor.amount) < 0.01) {
        creditorIndex++;
      }
      // Similarly, move to the next debtor.
      if (Math.abs(debtor.amount) < 0.01) {
        debtorIndex++;
      }
    }

    // Update the state with the settlement plan.
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        report: {
          ...state.currentEvent.report,
          settlementPlan: {
            transactions,
            totalTransactions: transactions.length,
            // A quick check: if the sum of net balances is near zero, we're settled.
            isSettled:
              Math.abs(
                Object.values(netBalances!).reduce((sum, val) => sum + val, 0)
              ) < 0.01,
          },
        },
      },
    }));
  },

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previousStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  setStep: (step) => set({ currentStep: step }),

  resetStore: () => set({ currentEvent: { ...initialEvent }, currentStep: 0 }),
}));
