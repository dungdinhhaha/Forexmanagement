import { createClient } from '@supabase/supabase-js'

// Kiểm tra biến môi trường một cách nghiêm ngặt hơn
const supabaseUrl = process.env.NODE_ENV === 'development' 
  ? 'https://ivfmfhcehyoeiwhaoxog.supabase.co' 
  : process.env.NEXT_PUBLIC_SUPABASE_URL || '';

const supabaseKey = process.env.NODE_ENV === 'development'
  ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2Zm1maGNlaHlvZWl3aGFveG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NjczMDIsImV4cCI6MjA1NzM0MzMwMn0.vSPmHcnO4x8Kks3duiom_R3N9k5AXqHU5Il1QEzujrg'
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Kiểm tra URL và key có giá trị và không rỗng
const hasValidConfig = (url: string, key: string) => {
  return url && key && url.trim() !== '' && key.trim() !== '';
};

// Tạo client chỉ khi có đầy đủ cấu hình
let supabaseClient = null;
if (hasValidConfig(supabaseUrl, supabaseKey)) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
  }
} else {
  console.warn('⚠️ Supabase environment variables are not set or empty. Supabase features will be disabled.');
}

// Export supabase client
export const supabase = supabaseClient;

// Tạo client admin với service role key
const supabaseServiceKey = process.env.NODE_ENV === 'development'
  ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2Zm1maGNlaHlvZWl3aGFveG9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTc2NzMwMiwiZXhwIjoyMDU3MzQzMzAyfQ.y77A7f9fPr7G_8wnZBdjWnZdwxaTdWeDYoVEaK3VoN8'
  : process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Server-side Supabase instance with service role
let adminClient = null;
if (hasValidConfig(supabaseUrl, supabaseServiceKey)) {
  try {
    adminClient = createClient(supabaseUrl, supabaseServiceKey);
  } catch (error) {
    console.error('❌ Error creating Supabase admin client:', error);
  }
} else {
  console.warn('⚠️ Supabase admin environment variables are not set or empty.');
}

// Export supabase admin client
export const supabaseAdmin = adminClient;

// Thêm hàm để kiểm tra trạng thái kết nối
export async function checkSupabaseConnection() {
  try {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return false;
    }
    
    const { data, error } = await supabase.from('trade_methods').select('count()', { count: 'exact' }).limit(0);
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Supabase connection check failed:', err);
    return false;
  }
}