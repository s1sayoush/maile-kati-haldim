import { Event } from "@/types/types";
import { firestore } from "./config";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

export const pushEvent = async (event: any, id: string) => {
  try {
    console.log("Trying to push event:", event);
    const eventRef = doc(firestore, "events", id);
    await setDoc(eventRef, { id, ...event });
  } catch (error) {
    console.error("Error pushing event", error);
  }
};

export const getEvent = async (id: string): Promise<Event> => {
  try {
    const eventRef = doc(firestore, "events", id);
    const eventDoc = await getDoc(eventRef);
    if (eventDoc.exists()) {
      return eventDoc.data() as Event;
    } else {
      throw new Error("Event not found");
    }
  } catch (error) {
    console.error("Error getting event", error);
    throw error;
  }
};

export const getAllEvent = async () => {
  try {
    const eventsSnapshot = await getDocs(collection(firestore, "events"));
    const events: Event[] = [];
    eventsSnapshot.forEach((doc) => {
      events.push(doc.data() as Event);
    });
    return events;
  } catch (error) {
    console.error("Error getting all events", error);
    throw error;
  }
};
