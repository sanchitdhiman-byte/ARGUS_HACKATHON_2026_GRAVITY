import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(date, 'dd MMM yyyy');
  } catch {
    return '-';
  }
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(date, 'dd MMM yyyy, hh:mm a');
  } catch {
    return '-';
  }
}

export function formatRelative(dateStr) {
  if (!dateStr) return '-';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '-';
  }
}

export function formatCurrency(amount) {
  if (amount == null) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num) {
  if (num == null) return '-';
  return new Intl.NumberFormat('en-IN').format(num);
}
