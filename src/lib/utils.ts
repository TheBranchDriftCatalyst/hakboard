import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateRandomId = () => {
  return `rand_id_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateRandomSize = () => {
  const sizes = [10, 20, 30];
  return sizes[Math.floor(Math.random() * sizes.length)];
};
