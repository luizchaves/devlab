import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** `clsx` resolve condicionais; `twMerge` resolve conflitos de utilitários do Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
