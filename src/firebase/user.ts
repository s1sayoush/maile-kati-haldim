import { firestore } from "./config";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  writeBatch,
} from "firebase/firestore";

interface UserDetails {
  avatar?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  address?: string;
  [key: string]: any;
}

export const saveUserDetails = async (
  uid: string,
  userDetails: UserDetails
): Promise<void> => {
  try {
    const userRef = doc(firestore, "players", uid);
    await setDoc(userRef, userDetails, { merge: true });
    await setDoc(userRef, { profileCompleted: true }, { merge: true });
  } catch (error) {
    console.error("Error saving user details:", error);
    throw new Error("Could not save user details");
  }
};

export const getUserDetails = async (
  uid: string,
  collection: string = "players"
): Promise<UserDetails | null> => {
  try {
    const docRef = doc(firestore, collection, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserDetails;
    } else {
      console.log(`No user document found for ID: ${uid}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Could not fetch user details");
  }
};

export const deleteUsersExcept = async () => {
  const exceptionDocIds = [
    "dyo6JcH6gZOPCowVtXGvqhcALIF3",
    "jZxyeVmCiXTLTT7CLK0UFmobONy2",
  ];

  try {
    const usersSnapshot = await getDocs(collection(firestore, "users"));

    const batch = writeBatch(firestore);

    usersSnapshot.forEach((doc) => {
      if (!exceptionDocIds.includes(doc.id)) {
        batch.delete(doc.ref);
      }
    });

    await batch.commit();
    console.log("Users deleted except for:", exceptionDocIds);
  } catch (error) {
    console.error("Error deleting users:", error);
  }
};

export default deleteUsersExcept;

// export const addTestPayments = async (uid: string, data: any) => {
//   try {
//     const userRef = doc(firestore, "players", uid);
//     await setDoc(userRef, { payments: data }, { merge: true });
//     console.log("added succesfully");
//   } catch (error) {
//     console.error("Error adding payments", error);
//   }
// };

// const handleAddPayments = async () => {
//   console.log("handle Add Payments pressed");
//   console.log(JSON.stringify(payments123, null, 2));
//   await addTestPayments(uid as string, payments123);
// };
