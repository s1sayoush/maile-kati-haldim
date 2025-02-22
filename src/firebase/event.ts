import { Event } from "@/types/types";
import { firestore } from "./config";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  query,
} from "firebase/firestore";

export const pushEvent = async (uid: string, event: any, eventId: string) => {
  try {
    const userRef = doc(firestore, "users", uid);
    const userRefSnapShot = await getDoc(userRef);
    if (!userRefSnapShot.exists()) {
      throw new Error("User not found");
    }
    await updateDoc(userRef, {
      events: arrayUnion(eventId),
    });

    console.log("Trying to push event:", event);
    const eventRef = doc(firestore, "events", eventId);
    await setDoc(eventRef, { id: eventId, ...event, deletedAt: null });
  } catch (error) {
    console.error("Error pushing event", error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const eventRef = doc(firestore, "events", eventId);
    const eventRefSnapShot = await getDoc(eventRef);
    if (!eventRefSnapShot.exists()) {
      throw new Error("Event not found");
    }
    await updateDoc(eventRef, { deletedAt: Timestamp.now() });
  } catch (error) {
    console.error("Error deleting event", error);
    throw error;
  }
};

export const getEvent = async (id: string): Promise<Event> => {
  try {
    const eventRef = doc(firestore, "events", id);
    const eventDoc = await getDoc(eventRef);
    if (eventDoc.exists()) {
      const eventData = eventDoc.data() as Event;
      if (eventData.deletedAt === null) {
        return eventData;
      } else {
        throw new Error("Event has been deleted");
      }
    } else {
      throw new Error("Event not found");
    }
  } catch (error) {
    console.error("Error getting event", error);
    throw error;
  }
};

export const getAllUserEvents = async (userId: string) => {
  try {
    const userRef = doc(firestore, "users", userId);
    const userDocSnap = await getDoc(userRef);

    if (!userDocSnap.exists()) {
      throw new Error("User not found");
    }

    const userData = userDocSnap.data();
    const eventIds = userData?.events || [];

    if (eventIds.length === 0) {
      return []; // No events for this user
    }

    // Fetch all events for the user, filtering out deleted ones
    const eventsPromises = eventIds.map(async (eventId: string) => {
      try {
        return await getEvent(eventId);
      } catch (error) {
        return null; // Ignore deleted events
      }
    });

    const events = (await Promise.all(eventsPromises)).filter(Boolean);
    return events;
  } catch (error) {
    console.error("Error fetching events for user", error);
    throw error;
  }
};
