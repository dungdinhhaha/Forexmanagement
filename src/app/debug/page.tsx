import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Debug - QLPP',
  description: 'Trang debug và kiểm tra trạng thái ứng dụng',
};

export default function DebugPage() {
  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Trang Debug</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Kiểm tra biến môi trường */}
        <Card>
          <CardHeader>
            <CardTitle>Kiểm tra biến môi trường</CardTitle>
            <CardDescription>
              Kiểm tra trạng thái của biến môi trường cho ứng dụng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Link href="/env-check" passHref>
                <Button className="w-full">Kiểm tra biến môi trường</Button>
              </Link>
              <Link href="/api/check-env" passHref>
                <Button variant="outline" className="w-full">API kiểm tra biến môi trường</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Kiểm tra Supabase */}
        <Card>
          <CardHeader>
            <CardTitle>Kiểm tra Supabase</CardTitle>
            <CardDescription>
              Kiểm tra kết nối tới Supabase từ client và server
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Link href="/api/debug/supabase-test" passHref>
                <Button className="w-full">Kiểm tra Supabase (Client)</Button>
              </Link>
              <Link href="/api/debug/check-supabase-server" passHref>
                <Button variant="outline" className="w-full">Kiểm tra Supabase (Server)</Button>
              </Link>
              <Link href="/api/debug/list-tables" passHref>
                <Button variant="outline" className="w-full">Liệt kê bảng dữ liệu</Button>
              </Link>
              <Link href="/api/debug/schema-info" passHref>
                <Button variant="outline" className="w-full">Kiểm tra cấu trúc DB</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Kiểm tra Tâm lý */}
        <Card>
          <CardHeader>
            <CardTitle>Kiểm tra API Tâm lý</CardTitle>
            <CardDescription>
              Kiểm tra các API liên quan đến mô-đun kiểm tra tâm lý
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Link href="/api/psychology/questions" passHref>
                <Button className="w-full">Danh sách câu hỏi</Button>
              </Link>
              <Link href="/api/psychology/results" passHref>
                <Button variant="outline" className="w-full">Kết quả kiểm tra</Button>
              </Link>
              <Link href="/api/psychology/sample-result" passHref>
                <Button variant="outline" className="w-full">Tạo kết quả mẫu</Button>
              </Link>
              <Link href="/api/debug/psychology-service" passHref>
                <Button variant="outline" className="w-full">Kiểm tra Psychology Service</Button>
              </Link>
              <Link href="/api/debug/psychology-tables" passHref>
                <Button variant="outline" className="w-full">Kiểm tra bảng Psychology</Button>
              </Link>
              <Link href="/api/debug/seed-psychology" passHref>
                <Button variant="outline" className="w-full">Seed dữ liệu Psychology</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Thông tin hệ thống */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin hệ thống</CardTitle>
            <CardDescription>
              Thông tin về Node.js, Next.js và phiên bản ứng dụng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Link href="/api/debug/system-info" passHref>
                <Button className="w-full">Thông tin hệ thống</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Trang này chỉ dành cho mục đích phát triển và debug.</p>
      </div>
    </div>
  );
} 