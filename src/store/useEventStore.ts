import { create } from "zustand";
import { nanoid } from "nanoid";
import { Event, BillItem, EventDetails, Person } from "@/types/types";

interface EventStore {
  // Event state
  currentEvent: Event | null;
  currentStep: number;

  // Event Details
  setEventDetails: (details: EventDetails) => void;

  // Participant Management
  addParticipant: (person: Person) => void;
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, person: Person) => void;

  // Bill Items
  addBillItem: (item: Omit<BillItem, "id">) => void;
  updateBillItem: (id: string, item: Partial<BillItem>) => void;
  removeBillItem: (id: string) => void;

  // Common Fund Management
  getCommonFundTotal: () => number;
  getItemCommonPayment: (itemId: string) => number;

  // Calculations
  calculateTotalPaid: (personId: string) => number;
  calculateTotalOwed: (personId: string) => number;

  // Navigation
  nextStep: () => void;
  previousStep: () => void;
  setStep: (step: number) => void;

  // Reset
  resetStore: () => void;
}

const initialEvent: Event = {
  details: {
    eventTitle: "",
    location: "",
    coordinates: [27.7172, 85.324],
  },
  participants: [],
  items: [],
};

export const useEventStore = create<EventStore>((set, get) => ({
  currentEvent: initialEvent,
  currentStep: 0,

  setEventDetails: (details) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent!,
        details,
      },
    })),

  addParticipant: (person) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent!,
        participants: [
          ...state.currentEvent!.participants,
          {
            id: nanoid(),
            name: person.name as string,
            phone: person.phone,
            email: person.email,
          },
        ],
      },
    })),

  removeParticipant: (id) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent!,
        participants: state.currentEvent!.participants.filter(
          (p) => p.id !== id
        ),
        items: state.currentEvent!.items.map((item) => ({
          ...item,
          payments: item.payments.filter((p) => p.personId !== id),
          liablePersons: item.liablePersons.filter((p) => p !== id),
        })),
      },
    })),

  updateParticipant: (id, person) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent!,
        participants: state.currentEvent!.participants.map((p) =>
          p.id === id ? { ...p, ...person } : p
        ),
      },
    })),

  addBillItem: (item) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent!,
        items: [...state.currentEvent!.items, { ...item, id: nanoid() }],
      },
    })),

  updateBillItem: (id, updates) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent!,
        items: state.currentEvent!.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      },
    })),

  removeBillItem: (id) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent!,
        items: state.currentEvent!.items.filter((item) => item.id !== id),
      },
    })),

  getCommonFundTotal: () => {
    const state = get();
    return state.currentEvent!.items.reduce((total, item) => {
      const commonPayment = item.payments.find((p) => p.personId === "common");
      return total + (commonPayment?.amount || 0);
    }, 0);
  },

  getItemCommonPayment: (itemId) => {
    const state = get();
    const item = state.currentEvent!.items.find((item) => item.id === itemId);
    const commonPayment = item?.payments.find((p) => p.personId === "common");
    return commonPayment?.amount || 0;
  },

  calculateTotalPaid: (personId) => {
    const state = get();
    return state.currentEvent!.items.reduce((total, item) => {
      const payment = item.payments.find((p) => p.personId === personId);
      return total + (payment?.amount || 0);
    }, 0);
  },

  calculateTotalOwed: (personId) => {
    const state = get();
    return state.currentEvent!.items.reduce((total, item) => {
      if (item.liablePersons.includes(personId)) {
        const commonPayment =
          item.payments.find((p) => p.personId === "common")?.amount || 0;
        const remainingAmount = item.amount - commonPayment;
        const perPersonShare = remainingAmount / item.liablePersons.length;
        return total + perPersonShare;
      }
      return total;
    }, 0);
  },

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previousStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  setStep: (step) => set({ currentStep: step }),

  resetStore: () => set({ currentEvent: initialEvent, currentStep: 0 }),
}));

// Helper function to generate summary report
export const generateSummaryReport = (event: Event) => {
  const paidByPerson: { [personId: string]: number } = {};
  const owedByPerson: { [personId: string]: number } = {};
  let totalAmount = 0;
  let commonFundAmount = 0;

  // Calculate commons and totals
  event.items.forEach((item) => {
    totalAmount += item.amount;

    // Track payments
    item.payments.forEach((payment) => {
      if (payment.personId === "common") {
        commonFundAmount += payment.amount;
      } else {
        paidByPerson[payment.personId] =
          (paidByPerson[payment.personId] || 0) + payment.amount;
      }
    });

    // Calculate what each person owes
    const commonPayment =
      item.payments.find((p) => p.personId === "common")?.amount || 0;
    const remainingAmount = item.amount - commonPayment;

    if (item.liablePersons.length > 0) {
      const perPersonShare = remainingAmount / item.liablePersons.length;
      item.liablePersons.forEach((personId) => {
        owedByPerson[personId] = (owedByPerson[personId] || 0) + perPersonShare;
      });
    }
  });

  return {
    totalAmount,
    commonFundAmount,
    paidByPerson,
    owedByPerson,
  };
};
