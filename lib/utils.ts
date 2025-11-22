import { ALERT_TYPES, IAlertType } from '@/constants';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const notify = (message: string, type: IAlertType = ALERT_TYPES.success) => {
  toast(message, {
    autoClose: 3000,
    type: type,
  });
};
