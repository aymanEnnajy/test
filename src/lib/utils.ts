import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  return d.toLocaleDateString('en-US', defaultOptions);
}

export function formatDateTime(date: string | Date | null): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number | null, currency = 'USD'): string {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatNumber(num: number | null): string {
  if (num === null || num === undefined) return '-';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function getInitials(firstName: string | null, lastName: string | null): string {
  if (!firstName && !lastName) return 'U';
  const first = firstName?.charAt(0) || '';
  const last = lastName?.charAt(0) || '';
  return (first + last).toUpperCase();
}

export function calculateDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: 'bg-emerald-500',
    INACTIVE: 'bg-gray-500',
    PENDING: 'bg-amber-500',
    APPROVED: 'bg-emerald-500',
    REJECTED: 'bg-red-500',
    COMPLETED: 'bg-emerald-500',
    CANCELLED: 'bg-gray-500',
    PRESENT: 'bg-emerald-500',
    ABSENT: 'bg-red-500',
    LATE: 'bg-amber-500',
    ON_LEAVE: 'bg-blue-500',
    TODO: 'bg-gray-500',
    IN_PROGRESS: 'bg-blue-500',
    UNDER_REVIEW: 'bg-amber-500',
    HIGH: 'bg-red-500',
    MEDIUM: 'bg-amber-500',
    LOW: 'bg-emerald-500',
    URGENT: 'bg-red-600',
    DRAFT: 'bg-gray-500',
    PAID: 'bg-emerald-500',
    PUBLISHED: 'bg-emerald-500',
    CLOSED: 'bg-gray-500',
    FILLED: 'bg-blue-500',
    NEW: 'bg-blue-500',
    SCREENING: 'bg-amber-500',
    INTERVIEW: 'bg-purple-500',
    OFFER: 'bg-emerald-500',
    HIRED: 'bg-emerald-600',
    PROCESSING: 'bg-amber-500',
    READY: 'bg-blue-500',
    DELIVERED: 'bg-emerald-500',
  };
  return colors[status] || 'bg-gray-500';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
