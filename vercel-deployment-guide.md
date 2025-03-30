# Hướng dẫn deploy lên Vercel

## Cách 1: Deploy bằng Vercel CLI

1. Mở Command Prompt hoặc PowerShell mới

2. Cài đặt Vercel CLI
```
npm install -g vercel
```

3. Di chuyển đến thư mục dự án của bạn
```
cd "D:\qlpp web"
```

4. Đăng nhập vào Vercel (nếu chưa đăng nhập)
```
vercel login
```

5. Deploy lên production
```
vercel --prod
```

6. Làm theo hướng dẫn hiển thị trên màn hình:
   - Xác nhận đường dẫn thư mục dự án
   - Liên kết với dự án hiện có (chọn "forexmanagement")
   - Xác nhận các cài đặt mặc định
   - Xác nhận deploy lên production

7. Sau khi hoàn tất, bạn sẽ nhận được URL của ứng dụng đã deploy

## Cách 2: Deploy từ GitHub

1. Đảm bảo bạn đã thêm tất cả các thay đổi vào Git
```
git add .
```

2. Tạo commit mới
```
git commit -m "Update for production deployment"
```

3. Push lên branch main
```
git push origin main
```

4. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
   - Chọn dự án "forexmanagement"
   - Click vào "Deployments"
   - Xác nhận rằng deployment mới đang được xử lý

## Cách 3: Deploy trực tiếp từ Vercel Dashboard

1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)

2. Chọn dự án "forexmanagement"

3. Click vào "Deployments"

4. Click vào "Deploy" hoặc "Redeploy"
   - Chọn "Deploy" nếu không có bản deployment nào
   - Chọn "Redeploy" nếu đã có bản deployment trước đó

5. Chọn "Production" làm Environment

6. Click "Deploy"

## Lưu ý quan trọng

1. Đảm bảo các biến môi trường đã được cấu hình đúng trong Vercel
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_TOKEN
   - SUPABASE_SERVICE_ROLE_KEY
   - OPENAI_API_KEY

2. Sau khi deploy, kiểm tra logs trong Vercel Dashboard để phát hiện lỗi

3. Test các chức năng chính của ứng dụng sau khi deploy

## Khắc phục sự cố

1. Nếu có lỗi về Node.js version, hãy thêm file `.nvmrc` vào dự án:
```
echo "18.x" > .nvmrc
```

2. Nếu có lỗi về dependencies, hãy xóa node_modules và cài đặt lại:
```
rm -rf node_modules
npm install
```

3. Nếu deployment không tự động kích hoạt, hãy kiểm tra webhook trong GitHub repository settings 