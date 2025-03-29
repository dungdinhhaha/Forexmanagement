# Web Trading Management System

Hệ thống quản lý và phân tích phương pháp giao dịch forex.

## Công nghệ sử dụng

- Frontend: Next.js, TypeScript, TailwindCSS
- Backend: Supabase (Authentication, Database, Storage)
- AI Integration: OpenAI API

## Cài đặt

1. Clone repository:
```bash
git clone [repository-url]
cd trading-management-system
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env.local` và cập nhật các biến môi trường:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

4. Chạy dự án:
```bash
npm run dev
```

## Cấu trúc dự án

```
src/
├── app/              # Next.js app router
├── components/       # React components
├── lib/             # Utilities và configurations
├── hooks/           # Custom React hooks
└── services/        # API services
```

## Tính năng chính

- Xác thực người dùng với Supabase Auth
- Quản lý phương pháp giao dịch
- Quản lý giao dịch
- Phân tích hiệu quả phương pháp với AI
- Phân tích tâm lý giao dịch
- Thống kê và báo cáo

## License

MIT 