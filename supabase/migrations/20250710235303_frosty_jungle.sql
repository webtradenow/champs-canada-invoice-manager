/*
  # Add Sample Data for Champs Invoice Management System

  1. Sample Data
    - Sample invoices for testing
    - Sample SKU mappings for all retailers
    - Sample processing logs
    - Sample webhook logs

  2. Notes
    - All data is for demonstration purposes
    - Uses realistic values for Champs Canada business
    - Provides data for all dashboard metrics
*/

-- Insert sample invoices
INSERT INTO invoices (invoice_number, retailer, amount, status, date, items_count, processing_time) VALUES
  ('INV-2024-001', 'Wholesaler A', 2450.00, 'processed', '2024-01-15', 15, '2 minutes 6 seconds'),
  ('INV-2024-002', 'Wholesaler B', 1890.50, 'pending', '2024-01-15', 8, NULL),
  ('INV-2024-003', 'Wholesaler C', 3250.75, 'processing', '2024-01-14', 22, '1 minute 48 seconds'),
  ('INV-2024-004', 'Wholesaler D', 890.25, 'error', '2024-01-14', 5, '30 seconds'),
  ('INV-2024-005', 'Wholesaler A', 1750.00, 'processed', '2024-01-13', 12, '2 minutes 18 seconds'),
  ('INV-2024-006', 'Wholesaler B', 2100.00, 'processed', '2024-01-13', 18, '1 minute 55 seconds'),
  ('INV-2024-007', 'Wholesaler C', 1450.25, 'processed', '2024-01-12', 9, '2 minutes 2 seconds'),
  ('INV-2024-008', 'Wholesaler D', 3100.50, 'processed', '2024-01-12', 25, '2 minutes 45 seconds')
ON CONFLICT (invoice_number) DO NOTHING;

-- Insert sample SKU mappings
INSERT INTO sku_mappings (retailer_sku, internal_sku, retailer, product_name, category, price, is_active) VALUES
  ('WA-LG-001', 'CH-LUGGAGE-001', 'Wholesaler A', 'Premium Travel Luggage Set', 'Luggage', 299.99, true),
  ('WB-BP-002', 'CH-BACKPACK-002', 'Wholesaler B', 'Business Backpack', 'Backpacks', 89.99, true),
  ('WC-DL-003', 'CH-DUFFEL-003', 'Wholesaler C', 'Sports Duffel Bag', 'Duffel Bags', 149.99, false),
  ('WD-CB-004', 'CH-CARRYON-004', 'Wholesaler D', 'Carry-On Spinner', 'Luggage', 199.99, true),
  ('WA-TB-005', 'CH-TOTE-005', 'Wholesaler A', 'Leather Tote Bag', 'Tote Bags', 129.99, true),
  ('WB-LG-006', 'CH-LUGGAGE-006', 'Wholesaler B', 'Hard Shell Luggage', 'Luggage', 249.99, true),
  ('WC-BP-007', 'CH-BACKPACK-007', 'Wholesaler C', 'Travel Backpack', 'Backpacks', 119.99, true),
  ('WD-DL-008', 'CH-DUFFEL-008', 'Wholesaler D', 'Gym Duffel Bag', 'Duffel Bags', 79.99, true),
  ('WA-CB-009', 'CH-CARRYON-009', 'Wholesaler A', 'Expandable Carry-On', 'Luggage', 179.99, true),
  ('WB-TB-010', 'CH-TOTE-010', 'Wholesaler B', 'Canvas Tote Bag', 'Tote Bags', 59.99, true)
ON CONFLICT (retailer_sku, retailer_id) DO NOTHING;

-- Insert sample processing logs
INSERT INTO processing_logs (step, status, message, execution_time) VALUES
  ('OCR Processing', 'completed', 'Successfully extracted invoice data', '45 seconds'),
  ('SKU Mapping', 'completed', 'All SKUs mapped successfully', '12 seconds'),
  ('Data Validation', 'completed', 'Invoice data validated', '8 seconds'),
  ('Database Insert', 'completed', 'Invoice saved to database', '3 seconds'),
  ('Webhook Notification', 'completed', 'Retailer notified of processing', '2 seconds'),
  ('OCR Processing', 'error', 'Failed to read PDF - corrupted file', '30 seconds'),
  ('SKU Mapping', 'warning', 'Unknown SKU found: WX-UNKNOWN-001', '15 seconds'),
  ('Data Validation', 'completed', 'Invoice data validated with warnings', '10 seconds')
ON CONFLICT DO NOTHING;

-- Insert sample webhook logs
INSERT INTO webhook_logs (endpoint, method, response_status, execution_time) VALUES
  ('https://api.wholesaler-a.com/webhook', 'POST', 200, '1.2 seconds'),
  ('https://api.wholesaler-b.com/webhook', 'POST', 200, '0.8 seconds'),
  ('https://api.wholesaler-c.com/webhook', 'POST', 500, '5.0 seconds'),
  ('https://api.wholesaler-d.com/webhook', 'POST', 200, '1.1 seconds'),
  ('https://api.wholesaler-a.com/webhook', 'POST', 200, '0.9 seconds'),
  ('https://api.wholesaler-b.com/webhook', 'POST', 404, '2.3 seconds'),
  ('https://api.wholesaler-c.com/webhook', 'POST', 200, '1.5 seconds'),
  ('https://api.wholesaler-d.com/webhook', 'POST', 200, '1.0 seconds')
ON CONFLICT DO NOTHING;