import {
  ONE_BILLION,
  ONE_MILLION,
  ONE_THOUSAND,
} from '@/constants/magicNumbers';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
  const FIX_DECIMAL_DIGITS = 2;
  if (volume >= ONE_BILLION) {
    return `${(volume / ONE_BILLION).toFixed(FIX_DECIMAL_DIGITS)}B`;
  } else if (volume >= ONE_MILLION) {
    return `${(volume / ONE_MILLION).toFixed(FIX_DECIMAL_DIGITS)}M`;
  } else if (volume >= ONE_THOUSAND) {
    return `${(volume / ONE_THOUSAND).toFixed(FIX_DECIMAL_DIGITS)}K`;
  }
  return volume.toString();
}
