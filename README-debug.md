# Trang Debug và Kiểm Tra Hệ Thống

Dự án này bao gồm các trang và API dùng để kiểm tra, debug các vấn đề liên quan đến biến môi trường, kết nối Supabase và hoạt động chung của ứng dụng.

## Trang Debug

Truy cập trang debug tại đường dẫn: `/debug`

Trang này sẽ hiển thị các liên kết đến các công cụ kiểm tra khác nhau:

1. **Kiểm tra biến môi trường**
   - Trang web: `/env-check`
   - API: `/api/check-env`

2. **Kiểm tra Supabase**
   - API kiểm tra client: `/api/debug/supabase-test`
   - API kiểm tra server: `/api/debug/check-supabase-server`

3. **Kiểm tra API Tâm lý**
   - Danh sách câu hỏi: `/api/psychology/questions`
   - Kết quả kiểm tra: `/api/psychology/results`
   - Tạo kết quả mẫu: `/api/psychology/sample-result`

4. **Thông tin hệ thống**
   - API: `/api/debug/system-info`

## Các API Kiểm Tra

### Kiểm Tra Biến Môi Trường

API `/api/check-env` trả về thông tin về các biến môi trường đã được cấu hình, không hiển thị giá trị thực của biến môi trường mà chỉ kiểm tra xem các biến đã được thiết lập hay chưa.

Các biến môi trường quan trọng bao gồm:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

### Kiểm Tra Kết Nối Supabase

Có hai API để kiểm tra kết nối Supabase:

1. **API Client-side** (`/api/debug/supabase-test`):
   - Sử dụng ANON KEY để kết nối, giống như cách client-side của ứng dụng kết nối
   - Thử truy vấn dữ liệu đơn giản và đo thời gian phản hồi

2. **API Server-side** (`/api/debug/check-supabase-server`):
   - Sử dụng SERVICE ROLE KEY để kết nối, giống như cách server-side của ứng dụng kết nối
   - Thử truy vấn dữ liệu đơn giản và đo thời gian phản hồi

### Thông Tin Hệ Thống

API `/api/debug/system-info` trả về thông tin chi tiết về:
- Thông tin hệ thống (hostname, platform, memory, CPU, etc.)
- Thông tin Node.js (phiên bản, môi trường)
- Thông tin process (PID, memory usage, etc.)
- Thông tin ứng dụng (tên, phiên bản, build ID)
- Thông tin môi trường Vercel (nếu chạy trên Vercel)

## Trang Kiểm Tra Biến Môi Trường

Truy cập trang kiểm tra biến môi trường tại đường dẫn: `/env-check`

Trang này sẽ hiển thị:
- Trạng thái các biến môi trường client-side
- Trạng thái các biến môi trường server-side (thông qua API)
- Môi trường hiện tại (development, production, etc.)
- Timestamp

## Lưu ý bảo mật

- Các trang và API debug chỉ nên được sử dụng trong môi trường development hoặc staging
- Trong môi trường production, bạn nên bảo vệ các API này hoặc vô hiệu hóa chúng
- Không hiển thị giá trị thực của các biến môi trường nhạy cảm, chỉ kiểm tra xem chúng đã được thiết lập hay chưa

## Sử dụng cho triển khai

Khi triển khai ứng dụng (deployment), bạn có thể sử dụng các API này để kiểm tra xem các biến môi trường và kết nối đã được thiết lập đúng cách hay chưa. 