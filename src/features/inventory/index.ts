/**
 * Inventory Feature — Public API
 */

// Types
export * from './types';

// Service
export { InventoryService } from './services/InventoryService';

// Store
export { useInventoryStore, selectEmptyMedications, selectEmptyCount } from './store/useInventoryStore';

// Components
export { InventoryIndicator } from './components/InventoryIndicator';
export { InventoryBadge } from './components/InventoryBadge';
