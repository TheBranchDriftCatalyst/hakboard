import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomWidgetID = (widgetType = "text") => {
  return `${widgetType}::${Math.random().toString(36).substr(2, 9)}`;
};

export const generateRandomSize = () => {
  const sizes = [10, 20, 30];
  return sizes[Math.floor(Math.random() * sizes.length)];
};
