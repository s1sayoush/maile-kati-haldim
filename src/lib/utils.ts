import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (fullName?: string | null) => {
  if (!fullName?.trim()) return "";

  const nameParts = fullName
    .trim()
    .split(" ")
    .filter((part) => part.length > 0);

  // If there's only one word, use first and last letter of that word
  if (nameParts.length === 1) {
    const word = nameParts[0];
    return word.length > 1 ? word[0] + word[word.length - 1] : word[0];
  }

  // Use first letter of first word and first letter of last word
  const firstInitial = nameParts[0][0];
  const lastInitial = nameParts[nameParts.length - 1][0];

  return (firstInitial + lastInitial).toUpperCase();
};
