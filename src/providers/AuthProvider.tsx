"use client";

// authContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { sendResetPasswordEmail } from "@/firebase/auth";

type AuthContextType = {
  uid: string | null;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [uid, setUid] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
        router.push("/auth/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const logout = async () => {
    await signOut(auth);
    setUid(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        uid,
        logout,
        resetPassword: sendResetPasswordEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
