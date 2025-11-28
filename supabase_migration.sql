-- Add plaid_item_id column to transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS plaid_item_id uuid REFERENCES user_plaid_items(id);

-- Optional: Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_plaid_item_id ON transactions(plaid_item_id);
