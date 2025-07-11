/*
  # Update Retailer Names to Real Brands

  1. Updates
    - Replace generic "Wholesaler A, B, C, D" with real retailer names
    - Update existing sample data to use new retailer names
    - Maintain data consistency across all tables

  2. New Retailer Names
    - Bentley's
    - Walmart
    - Target
    - Champs Canada
    - Champs International
*/

-- Update retailer names in retailers table
UPDATE retailers SET 
  name = 'Bentley''s',
  code = 'BEN'
WHERE code = 'WA';

UPDATE retailers SET 
  name = 'Walmart',
  code = 'WMT'
WHERE code = 'WB';

UPDATE retailers SET 
  name = 'Target',
  code = 'TGT'
WHERE code = 'WC';

UPDATE retailers SET 
  name = 'Champs Canada',
  code = 'CCA'
WHERE code = 'WD';

-- Add Champs International as a new retailer
INSERT INTO retailers (name, code, api_endpoint, status) VALUES
  ('Champs International', 'CIN', 'https://api.champs-international.com', 'active')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  api_endpoint = EXCLUDED.api_endpoint;

-- Update existing invoice data
UPDATE invoices SET retailer = 'Bentley''s' WHERE retailer = 'Wholesaler A';
UPDATE invoices SET retailer = 'Walmart' WHERE retailer = 'Wholesaler B';
UPDATE invoices SET retailer = 'Target' WHERE retailer = 'Wholesaler C';
UPDATE invoices SET retailer = 'Champs Canada' WHERE retailer = 'Wholesaler D';

-- Update existing SKU mapping data
UPDATE sku_mappings SET 
  retailer = 'Bentley''s',
  retailer_sku = REPLACE(retailer_sku, 'WA-', 'BEN-')
WHERE retailer = 'Wholesaler A';

UPDATE sku_mappings SET 
  retailer = 'Walmart',
  retailer_sku = REPLACE(retailer_sku, 'WB-', 'WMT-')
WHERE retailer = 'Wholesaler B';

UPDATE sku_mappings SET 
  retailer = 'Target',
  retailer_sku = REPLACE(retailer_sku, 'WC-', 'TGT-')
WHERE retailer = 'Wholesaler C';

UPDATE sku_mappings SET 
  retailer = 'Champs Canada',
  retailer_sku = REPLACE(retailer_sku, 'WD-', 'CCA-')
WHERE retailer = 'Wholesaler D';

-- Add some sample data for Champs International
INSERT INTO invoices (invoice_number, retailer, amount, status, date, items_count, processing_time) VALUES
  ('INV-2024-009', 'Champs International', 4200.00, 'processed', '2024-01-15', 28, '3 minutes 12 seconds'),
  ('INV-2024-010', 'Champs International', 1650.75, 'pending', '2024-01-14', 11, NULL)
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO sku_mappings (retailer_sku, internal_sku, retailer, product_name, category, price, is_active) VALUES
  ('CIN-LG-011', 'CH-LUGGAGE-011', 'Champs International', 'International Travel Set', 'Luggage', 399.99, true),
  ('CIN-BP-012', 'CH-BACKPACK-012', 'Champs International', 'Global Explorer Backpack', 'Backpacks', 159.99, true)
ON CONFLICT (retailer_sku, retailer_id) DO NOTHING;