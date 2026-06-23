/**
 * PillBit Shared Components — Barrel Export
 *
 * Import all shared UI components from this single entry point.
 *
 * Usage:
 *   import { Button, Card, Input, EmptyState } from '@/components';
 *
 * Rules (from ARCHITECTURE.md):
 * - These components are presentation-only ("dumb").
 * - They must NOT import from features/ or services/.
 * - They may import from @/constants only.
 */

export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
export { EmptyState } from './EmptyState';
