'use client';

import { useState, useEffect } from 'react';

export default function EnvChecker() {
  const [clientEnv, setClientEnv] = useState({
    NEXT_PUBLIC_SUPABASE_URL: false,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: false,
  });
  const [serverEnv, setServerEnv] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Kiểm tra biến môi trường phía client
    setClientEnv({
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });

    // Kiểm tra biến môi trường phía server
    const checkServerEnv = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/check-env');
        if (!res.ok) {
          throw new Error(`Status: ${res.status}`);
        }
        const data = await res.json();
        setServerEnv(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi khi kiểm tra biến môi trường');
      } finally {
        setLoading(false);
      }
    };

    checkServerEnv();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Đang kiểm tra biến môi trường...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Lỗi: {error}</div>;
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-semibold mb-4">Kiểm tra biến môi trường</h2>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Phía client (browser):</h3>
        <ul className="list-disc pl-5">
          <li className={clientEnv.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
            NEXT_PUBLIC_SUPABASE_URL: {clientEnv.NEXT_PUBLIC_SUPABASE_URL ? 'Có' : 'Không'}
          </li>
          <li className={clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
            NEXT_PUBLIC_SUPABASE_ANON_KEY: {clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Có' : 'Không'}
          </li>
        </ul>
      </div>
      
      {serverEnv && (
        <div>
          <h3 className="font-medium mb-2">Phía server:</h3>
          <ul className="list-disc pl-5">
            <li className={serverEnv.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
              NEXT_PUBLIC_SUPABASE_URL: {serverEnv.NEXT_PUBLIC_SUPABASE_URL ? 'Có' : 'Không'}
            </li>
            <li className={serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
              NEXT_PUBLIC_SUPABASE_ANON_KEY: {serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Có' : 'Không'}
            </li>
            <li className={serverEnv.SUPABASE_SERVICE_ROLE_KEY ? 'text-green-600' : 'text-red-600'}>
              SUPABASE_SERVICE_ROLE_KEY: {serverEnv.SUPABASE_SERVICE_ROLE_KEY ? 'Có' : 'Không'}
            </li>
            <li className={serverEnv.OPENAI_API_KEY ? 'text-green-600' : 'text-red-600'}>
              OPENAI_API_KEY: {serverEnv.OPENAI_API_KEY ? 'Có' : 'Không'}
            </li>
            <li>NODE_ENV: {serverEnv.NODE_ENV}</li>
            <li>Thời gian: {new Date(serverEnv.timestamp).toLocaleString()}</li>
          </ul>
        </div>
      )}
    </div>
  );
} 