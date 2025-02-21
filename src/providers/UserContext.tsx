"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { getUserDetails } from "@/firebase/user";

interface UserContextType {
  userDetails: any | null;
  loading: boolean;
  error: any;
  refreshUserDetails: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  userDetails: null,
  loading: true,
  error: null,
  refreshUserDetails: async () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const refreshUserDetails = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const details = await getUserDetails(user.uid);
        setUserDetails({ ...details, id: user.uid });
      }
    } catch (err) {
      setError(err);
      console.error("Error refreshing user details:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const details = await getUserDetails(user.uid);
          setUserDetails({ ...details, id: user.uid });
        } else {
          setUserDetails(null);
        }
      } catch (err) {
        setError(err);
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{ userDetails, loading, error, refreshUserDetails }}
    >
      {children}
    </UserContext.Provider>
  );
};
