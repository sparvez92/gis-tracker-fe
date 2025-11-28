import { ALERT_TYPES, IAlertType } from '@/constants';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const notify = (message: string, type: IAlertType = ALERT_TYPES.success) => {
  toast(message, {
    autoClose: 3000,
    type: type,
  });
};

export 
function toOnlyDate(value?: string | Date | null): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (isNaN(d.getTime())) return undefined;

  return d.toISOString().split("T")[0]; // "2025-11-24"
}


export function formatMMDDYYYY(date: Date | string): string {
  return date ? dayjs(date).format('MM/DD/YYYY') : '';
}