import { clsx } from "clsx";
import { mix } from "framer-motion";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with tailwindCSS support.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats credit amount as dollar value.
 */
export function formatCurrency(priceInCents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
}

/**
 * Format timestamp.
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
