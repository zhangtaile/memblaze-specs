// scripts/seed_supabase.js
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rawDataPath = path.resolve(process.cwd(), 'raw_data/SSD_spec.json');
const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf-8'));

// Map JSON data to match the database schema (flattened structure)
const mappedData = rawData.map(item => ({
  series: item.series,
  model: item.model,
  capacity: item.capacity,
  nand: item.nand,
  form_factor: item.form_factor,
  endurance_dwpd: item.endurance_dwpd,
  seq_read_gb_s: item.pcie_5_0_performance.seq_read_gb_s,
  seq_write_gb_s: item.pcie_5_0_performance.seq_write_gb_s,
  rand_read_kiops: item.pcie_5_0_performance.rand_read_kiops,
  rand_write_kiops: item.pcie_5_0_performance.rand_write_kiops,
  note: item.note
}));

async function seedData() {
  console.log('Clearing existing data...');
  const { error: deleteError } = await supabase
    .from('ssd_specs')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows (trick to delete without where clause if needed, though usually easier is truncate)

  if (deleteError) {
    console.error('Error clearing table:', deleteError);
    return;
  }

  console.log('Inserting new data...');
  const { data, error } = await supabase
    .from('ssd_specs')
    .insert(mappedData)
    .select();

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log(`Successfully inserted ${data.length} records.`);
  }
}

seedData();
