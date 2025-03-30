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

// Tạo một client giả khi không có cấu hình hợp lệ
const createMockClient = () => {
  console.warn('⚠️ Using mock Supabase client. Database operations will not work.');
  
  // Tạo các phương thức mock để phục vụ TypeScript
  const mockQueryBuilder = () => {
    const builder: any = {
      select: () => builder,
      insert: () => builder,
      update: () => builder,
      delete: () => builder,
      eq: () => builder,
      neq: () => builder,
      gt: () => builder,
      gte: () => builder,
      lt: () => builder,
      lte: () => builder,
      filter: () => builder,
      match: () => builder,
      in: () => builder,
      contains: () => builder,
      containedBy: () => builder,
      order: () => builder,
      range: () => builder,
      limit: () => builder,
      single: () => ({ data: null, error: new Error('Supabase is not configured') }),
      maybeSingle: () => ({ data: null, error: new Error('Supabase is not configured') }),
      then: () => Promise.resolve({ data: null, error: new Error('Supabase is not configured') })
    };
    
    return builder;
  };
  
  // Tạo các phương thức giả cho client
  return {
    from: () => mockQueryBuilder(),
    rpc: () => ({ data: null, error: new Error('Supabase is not configured') }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase is not configured') }),
      signOut: () => Promise.resolve({ error: null }),
    },
    // Hỗ trợ các phương thức Supabase khác
    storage: {
      from: () => ({
        upload: () => ({ data: null, error: new Error('Supabase is not configured') }),
        download: () => ({ data: null, error: new Error('Supabase is not configured') }),
        list: () => ({ data: null, error: new Error('Supabase is not configured') }),
      })
    }
  };
};

// Tạo client với cấu hình hợp lệ hoặc client giả
let supabaseClient;
if (hasValidConfig(supabaseUrl, supabaseKey)) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created successfully');
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
    supabaseClient = createMockClient();
  }
} else {
  console.warn('⚠️ Supabase environment variables are not set or empty.');
  supabaseClient = createMockClient();
}

// Export supabase client
export const supabase = supabaseClient;

// Tạo client admin với service role key
const supabaseServiceKey = process.env.NODE_ENV === 'development'
  ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2Zm1maGNlaHlvZWl3aGFveG9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTc2NzMwMiwiZXhwIjoyMDU3MzQzMzAyfQ.y77A7f9fPr7G_8wnZBdjWnZdwxaTdWeDYoVEaK3VoN8'
  : process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Server-side Supabase instance with service role
let adminClient;
if (hasValidConfig(supabaseUrl, supabaseServiceKey)) {
  try {
    adminClient = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase admin client created successfully');
  } catch (error) {
    console.error('❌ Error creating Supabase admin client:', error);
    adminClient = createMockClient();
  }
} else {
  console.warn('⚠️ Supabase admin environment variables are not set or empty.');
  adminClient = createMockClient();
}

// Export supabase admin client
export const supabaseAdmin = adminClient;

// Thêm hàm để kiểm tra trạng thái kết nối
export async function checkSupabaseConnection() {
  try {
    // Kiểm tra đơn giản
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase configuration is missing');
      return false;
    }
    
    try {
      // Sử dụng phương thức đơn giản hơn
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Supabase connection error:', error);
        return false;
      }
      
      console.log('Supabase connection successful');
      return true;
    } catch (queryError) {
      console.error('Supabase query error:', queryError);
      return false;
    }
  } catch (err) {
    console.error('Supabase connection check failed:', err);
    return false;
  }
}