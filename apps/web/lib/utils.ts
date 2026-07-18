import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 * Uses clsx for conditional classes + tailwind-merge for deduplication.
 *
 * @example
 * cn("px-4 py-2", condition && "bg-blue-500", "px-6")
 * // → "py-2 bg-blue-500 px-6" (px-4 removed, px-6 wins)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with locale-aware formatting.
 * @example formatNumber(2500) → "2,500"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/**
 * Delay execution for a given number of milliseconds.
 * Useful for simulated loading states in development.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
