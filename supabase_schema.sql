-- Create a new table for SSD specifications
CREATE TABLE IF NOT EXISTS ssd_specs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  series TEXT NOT NULL,
  model TEXT NOT NULL,
  capacity TEXT NOT NULL,
  nand TEXT NOT NULL,
  form_factor TEXT NOT NULL,
  endurance_dwpd NUMERIC NOT NULL,
  
  -- Flattened PCIe 5.0 Performance fields for easier querying
  seq_read_gb_s NUMERIC,
  seq_write_gb_s NUMERIC,
  rand_read_kiops INTEGER,
  rand_write_kiops INTEGER,
  
  note TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for security
ALTER TABLE ssd_specs ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to read data
CREATE POLICY "Public profiles are viewable by everyone" 
ON ssd_specs FOR SELECT 
USING (true);

-- (Optional) Create a policy to allow authenticated users to insert/update data
-- CREATE POLICY "Authenticated users can insert" 
-- ON ssd_specs FOR INSERT 
-- WITH CHECK (auth.role() = 'authenticated');
