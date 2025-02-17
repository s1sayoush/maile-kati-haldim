"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth } from "@/firebase/config";
const AuthStateHandler = () => {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    console.log("Starting auth check");
    let isMounted = true;

    const handleAuthChange = async (user: any) => {
      if (!isMounted) return;

      console.log("Auth state changed:", user ? "logged in" : "logged out");

      try {
        if (user) {
          await router.replace("/dashboard");
        } else {
          await router.replace("/auth/login");
        }
      } catch (error) {
        console.error("Navigation error:", error);
      } finally {
        setAuthChecked(true);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthChange);

    const timeoutId = setTimeout(() => {
      console.log("Fallback timeout triggered");
      if (!authChecked && isMounted) {
        router.replace("/auth/login");
      }
    }, 3000);

    return () => {
      isMounted = false;
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [router, authChecked]);

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative w-64 h-64">
          <Image
            src="/favicon.ico"
            fill
            className="object-contain"
            alt="logo"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default AuthStateHandler;
