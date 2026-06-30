/**
 * Low Stock Screen Route
 * 
 * Thin wrapper around the LowStockMedicationsScreen.
 * 
 * Route: /medications/low-stock
 */
import { LowStockMedicationsScreen } from '@/features/inventory';

export default function LowStockRoute() {
    return <LowStockMedicationsScreen />;
}
