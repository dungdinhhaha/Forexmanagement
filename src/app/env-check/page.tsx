import EnvChecker from '@/components/EnvChecker';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function EnvCheckPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Kiểm tra biến môi trường</h1>
      <div className="max-w-lg mx-auto">
        <EnvChecker />
      </div>
    </div>
  );
} 