const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dwrropzvxdykvdiuvlnp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cnJvcHp2eGR5a3ZkaXV2bG5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTExNTM4MywiZXhwIjoyMDY2NjkxMzgzfQ.Cd5GKM9P6Q9oAJiyTUz0XmVAADzO7256Uiy_x3KOhcI'; // pas clé publique
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
