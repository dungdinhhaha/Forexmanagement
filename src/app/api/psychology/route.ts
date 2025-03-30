// Kiểm tra:
// 1. Cách xác thực người dùng
// 2. Cách truy vấn repository
// 3. Cách xử lý lỗi 

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Psychology API endpoint" });
} 