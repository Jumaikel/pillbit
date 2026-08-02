export const removeLowStockMigration = `
ALTER TABLE pbt_medication DROP COLUMN mdc_low_stock_threshold;
ALTER TABLE pbt_application_setting DROP COLUMN ast_notify_low_stock;
ALTER TABLE pbt_application_setting DROP COLUMN ast_default_low_stock_threshold;
`;
