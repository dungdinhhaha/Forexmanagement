import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Hàm xử lý request GET
export async function GET() {
  const start = Date.now();
  
  try {
    // Kiểm tra biến môi trường
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing Supabase environment variables',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
    
    // Tạo client Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
    
    // Thực hiện truy vấn SQL để lấy danh sách bảng
    const { data: tables, error: tablesError } = await supabase
      .rpc('list_tables');
    
    if (tablesError) {
      // Nếu không có hàm RPC, thử truy vấn trực tiếp
      const { data: pgTables, error: pgError } = await supabase
        .from('pg_tables')
        .select('schemaname, tablename')
        .in('schemaname', ['public', 'auth'])
        .order('schemaname')
        .order('tablename');
      
      if (pgError) {
        // Sử dụng SQL thuần nếu cả hai cách trên đều không hoạt động
        const { data: sqlTables, error: sqlError } = await supabase
          .rpc('select_raw', { 
            sql: `
              SELECT 
                table_schema as schemaname,
                table_name as tablename
              FROM 
                information_schema.tables
              WHERE 
                table_schema IN ('public', 'auth')
              ORDER BY 
                table_schema, table_name
            `
          });
        
        if (sqlError) {
          console.error('Error listing tables:', sqlError);
          return NextResponse.json({
            status: 'error',
            message: 'Failed to list database tables',
            errors: [tablesError, pgError, sqlError],
            timestamp: new Date().toISOString(),
          }, { status: 500 });
        }
        
        return NextResponse.json({
          status: 'success',
          message: 'Tables retrieved using SQL query',
          data: sqlTables,
          responseTime: Date.now() - start,
          timestamp: new Date().toISOString(),
        });
      }
      
      return NextResponse.json({
        status: 'success',
        message: 'Tables retrieved from pg_tables',
        data: pgTables,
        responseTime: Date.now() - start,
        timestamp: new Date().toISOString(),
      });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Tables retrieved using RPC',
      data: tables,
      responseTime: Date.now() - start,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Server error when listing tables:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Server error when listing tables',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 