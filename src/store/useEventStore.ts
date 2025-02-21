import { create } from "zustand";
import { nanoid } from "nanoid";
import {
  Event,
  BillItem,
  EventDetails,
  Person,
  BillCategory,
  PaymentMethod,
} from "@/types/types";

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
  personIdtoName: (id: string) => void;

  // Bill Items
  addBillItem: (item: Omit<BillItem, "id">) => void;
  updateBillItem: (id: string, updates: Partial<Omit<BillItem, "id">>) => void;
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
  participants: [
    {
      id: "oGxz3r5Q-PgoQCAiCZCJL",
      name: "Sayoush Subedi",
      phone: "9867785168",
      email: "sayoushstark@gmail.com",
    },
    {
      id: "SYhWGzuBsAZF0moHOBfEm",
      name: "Tika Sharma",
      phone: "1234567900",
      email: "tgaire13@gmail.com",
    },
    {
      id: "aBcDeFgHiJkLmNoPqRsTu",
      name: "John Doe",
      phone: "5551234567",
      email: "johndoe123@example.com",
    },
    {
      id: "vXyZaBcDeFgHiJkLmNoPq",
      name: "Jane Smith",
      phone: "5559876543",
      email: "janesmith456@example.com",
    },
    {
      id: "rStUvWxYzAbCdEfGhIjKl",
      name: "Alice Johnson",
      phone: "5552345678",
      email: "alicej@example.com",
    },
    {
      id: "mNoPqRsTuVwXyZaBcDeFg",
      name: "Bob Brown",
      phone: "5558765432",
      email: "bobbrown@example.com",
    },
    {
      id: "hIjKlMnOpQrStUvWxYzAb",
      name: "Charlie Davis",
      phone: "5553456789",
      email: "charlied@example.com",
    },
    {
      id: "cDeFgHiJkLmNoPqRsTuVw",
      name: "Diana Evans",
      phone: "5557654321",
      email: "dianae@example.com",
    },
    {
      id: "wXyZaBcDeFgHiJkLmNoPq",
      name: "Ethan Harris",
      phone: "5554567890",
      email: "ethanh@example.com",
    },
    {
      id: "qRsTuVwXyZaBcDeFgHiJk",
      name: "Fiona Clark",
      phone: "5556543210",
      email: "fionac@example.com",
    },
    {
      id: "lMnOpQrStUvWxYzAbCdEf",
      name: "George Lewis",
      phone: "5555678901",
      email: "georgel@example.com",
    },
    {
      id: "vWxYzAbCdEfGhIjKlMnOp",
      name: "Hannah Walker",
      phone: "5554321098",
      email: "hannahw@example.com",
    },
    {
      id: "bCdEfGhIjKlMnOpQrStUv",
      name: "Ian Hall",
      phone: "5556789012",
      email: "ianh@example.com",
    },
    {
      id: "yZaBcDeFgHiJkLmNoPqRs",
      name: "Julia Young",
      phone: "5553210987",
      email: "juliay@example.com",
    },
    {
      id: "tUvWxYzAbCdEfGhIjKlMn",
      name: "Kevin King",
      phone: "5557890123",
      email: "kevink@example.com",
    },
    {
      id: "pQrStUvWxYzAbCdEfGhIj",
      name: "Laura Scott",
      phone: "5552109876",
      email: "lauras@example.com",
    },
    {
      id: "kLmNoPqRsTuVwXyZaBcDe",
      name: "Michael Green",
      phone: "5558901234",
      email: "michaelg@example.com",
    },
    {
      id: "fGhIjKlMnOpQrStUvWxYz",
      name: "Nina Adams",
      phone: "5551098765",
      email: "ninaa@example.com",
    },
    {
      id: "zAbCdEfGhIjKlMnOpQrSt",
      name: "Oscar Baker",
      phone: "5559012345",
      email: "oscarb@example.com",
    },
    {
      id: "uVwXyZaBcDeFgHiJkLmNo",
      name: "Paula Carter",
      phone: "5550123456",
      email: "paulac@example.com",
    },
  ],
  items: [
    {
      id: "1",
      itemName: "Dinner",
      amount: 100,
      category: BillCategory.FOOD,
      paymentMethod: PaymentMethod.COMBINATION,
      payments: [
        { personId: "SYhWGzuBsAZF0moHOBfEm", amount: 100 },
        { personId: "oGxz3r5Q-PgoQCAiCZCJL", amount: 0 },
        { personId: "ughaO90BBc2x1-0alDenI", amount: 0 },
      ],
      liablePersons: ["oGxz3r5Q-PgoQCAiCZCJL", "SYhWGzuBsAZF0moHOBfEm"],
    },
  ],
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

  personIdtoName: (id: string) => {
    const state = get();
    if (id === "common") return "Common";
    const person = state.currentEvent!.participants.find((p) => p.id === id);
    return person ? person.name : "Unknown";
  },

  addBillItem: (item) =>
    set((state) => {
      if (!state.currentEvent) return state;

      return {
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
      };
    }),

  updateBillItem: (id, updates) =>
    set((state) => {
      if (!state.currentEvent) return state;

      return {
        currentEvent: {
          ...state.currentEvent,
          items: state.currentEvent.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        },
      };
    }),

  removeBillItem: (id) =>
    set((state) => {
      if (!state.currentEvent) return state;

      return {
        currentEvent: {
          ...state.currentEvent,
          items: state.currentEvent.items.filter((item) => item.id !== id),
        },
      };
    }),

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
