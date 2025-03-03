import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a volume number into a more readable string representation.
 *
 * The function converts the volume into a string with appropriate suffixes:
 * - "B" for billions (1e9)
 * - "M" for millions (1e6)
 * - "K" for thousands (1e3)
 *
 * For example:
 * - 1500 will return "1.50K"
 * - 2500000 will return "2.50M"
 * - 3000000000 will return "3.00B"
 *
 * @param volume - The volume number to format.
 * @returns A string representing the formatted volume.
 */
export function formatVolume(volume: number): string {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(2)}B`;
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(2)}M`;
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(2)}K`;
  }
  return volume.toString();
}
