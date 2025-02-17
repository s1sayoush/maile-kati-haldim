import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, firestore } from "./config";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";

export const loginPlayers = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const userDoc = doc(firestore, "players", user.uid);
    const userSnap = await getDoc(userDoc);

    if (userSnap.exists()) {
      return { success: true, user };
    } else {
      await signOut(auth);
      return { success: false, error: "This User is not a Players" };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error during sign in" };
  }
};

export const createPlayersAccount = async (
  email: string,
  password: string,
  displayName?: string
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    const userDocRef = doc(firestore, "players", user.uid);

    try {
      await setDoc(userDocRef, {
        uid: user.uid,
        personalDetails: {
          email: user.email,
          fullName: "",
          profileImage: "",
          phone: "",
        },
        profileCompleted: false,
        createdAt: Timestamp.now(),
      });

      return { success: true, user };
    } catch (firestoreError) {
      await user.delete();
      console.error("Error writing to Firestore:", firestoreError);
      return { success: false, error: "Failed to create user profile" };
    }
  } catch (error) {
    console.error("Error during signup:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error during sign up" };
  }
};

export const signInWithPopupProvider = async (provider: string) => {
  try {
    let providerInstance;

    if (provider === "google") {
      providerInstance = new GoogleAuthProvider();
      providerInstance.addScope("email");
      providerInstance.addScope("profile");
    } else {
      throw new Error("Invalid provider");
    }

    const result = await signInWithPopup(auth, providerInstance);
    const user = result.user;

    const userDocRef = doc(firestore, "players", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      try {
        await setDoc(userDocRef, {
          uid: user.uid,
          personalDetails: {
            email: user.email,
            fullName: user.displayName,
            profileImage: user.photoURL,
            phone: "",
          },
          createdAt: Timestamp.now(),
          profileCompleted: false,
        });
      } catch (firestoreError) {
        console.error("Error writing to Firestore:", firestoreError);
        return { success: false, error: "Failed to create user profile" };
      }
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error during popup login", error);
    // Return more specific error message
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error during popup login" };
  }
};

export const deleteUser = async (
  uid: string,
  email: string,
  password: string
) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in.");
    }

    try {
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);
    } catch (credError) {
      return { success: false, error: "Invalid email or password" };
    }

    await user.delete();
    await updateDoc(doc(firestore, "players", uid), {
      deletedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error during user deletion", error);
    return { success: false, error: "Error deleting user" };
  }
};

export const sendResetPasswordEmail = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error("Error during password reset", error);
    return { success: false, error: "Error sending password reset email" };
  }
};
