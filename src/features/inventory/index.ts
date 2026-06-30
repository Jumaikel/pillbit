/**
 * Inventory Feature — Public API
 *
 * Only export what should be accessible to other modules.
 * Internal implementation details (service internals, raw queries)
 * should NOT be exported here.
 */

// Types
export * from './types';

// Service
export { InventoryService } from './services/InventoryService';

// Store
export {
    useInventoryStore,
    selectLowStockMedications,
    selectLowStockCount,
} from './store/useInventoryStore';

// Components
export { InventoryBadge } from './components/InventoryBadge';
export { InventoryStatusCard } from './components/InventoryStatusCard';
export { InventoryIndicator } from './components/InventoryIndicator';
export { LowStockBanner } from './components/LowStockBanner';

// Screens
export { LowStockMedicationsScreen } from './screens/LowStockMedicationsScreen';
