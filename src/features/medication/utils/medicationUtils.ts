/**
 * Medication Feature — Utility Functions
 *
 * Pure helper functions. No side effects, no imports from stores or services.
 */

import { ExpirationStatus } from '../types';

// ─── Date Helpers ─────────────────────────────────────────────────────────────

/**
 * Formats an ISO date string (YYYY-MM-DD) into a human-readable locale string.
 * Returns 'N/A' if the value is null/undefined.
 */
export function formatExpirationDate(isoDate: string | null | undefined): string {
  if (!isoDate) return 'N/A';
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Returns the number of days until a given ISO date string expires.
 * Negative values mean the date has already passed.
 */
export function daysUntilExpiration(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map(Number);
  const expiration = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiration.setHours(0, 0, 0, 0);
  const diffMs = expiration.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Derives the expiration status of a medication from its expiration date.
 *  - 'expired'  → date is in the past
 *  - 'expiring' → expires within 30 days
 *  - 'valid'    → more than 30 days remaining
 */
export function getExpirationStatus(isoDate: string): ExpirationStatus {
  const days = daysUntilExpiration(isoDate);
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring';
  return 'valid';
}

/**
 * Returns translation key and params for the expiration status.
 */
export function getExpirationLabel(isoDate: string): { key: string, params?: any } {
  const days = daysUntilExpiration(isoDate);
  if (days < 0) return { key: 'medications.common.expired' };
  if (days === 0) return { key: 'medications.common.expiresToday' };
  if (days === 1) return { key: 'medications.common.expiresTomorrow' };
  if (days <= 30) return { key: 'medications.common.expiresInDays', params: { days } };
  return { key: 'medications.common.expiresOnDate', params: { date: formatExpirationDate(isoDate) } };
}

/**
 * Validates that a string matches the YYYY-MM-DD format.
 */
export function isValidDateFormat(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
