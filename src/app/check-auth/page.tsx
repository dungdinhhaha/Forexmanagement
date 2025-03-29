'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function CheckAuth() {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [userData, setUserData] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const router = useRouter();
  
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClientComponentClient();
        
        // Kiểm tra session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('🔴 Error checking session:', error);
          setStatus('unauthenticated');
          return;
        }
        
        if (!session) {
          console.log('🟠 No session found');
          setStatus('unauthenticated');
          return;
        }
        
        // Lấy thông tin user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('🔴 Error getting user:', userError);
          setStatus('unauthenticated');
          return;
        }
        
        // Nếu có session và user, lưu thông tin và cập nhật trạng thái
        setUserData(user);
        setSessionData(session);
        setStatus('authenticated');
        
        // Fetch debug data from server
        const debugResponse = await fetch('/api/debug-user');
        const debugData = await debugResponse.json();
        setDebugInfo(debugData);
        
      } catch (error) {
        console.error('💥 Unexpected error:', error);
        setStatus('unauthenticated');
      }
    }
    
    checkAuth();
  }, []);
  
  const handleLogout = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signOut();
    router.refresh();
    setStatus('unauthenticated');
    setUserData(null);
    setSessionData(null);
  };
  
  if (status === 'loading') {
    return <div className="p-8">Đang kiểm tra xác thực...</div>;
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kiểm tra xác thực</h1>
      
      <div className="mb-4 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Trạng thái: {
          status === 'authenticated' 
            ? '✅ Đã đăng nhập' 
            : '❌ Chưa đăng nhập'
        }</h2>
        
        {userData && (
          <div className="mb-4">
            <h3 className="font-medium">Thông tin người dùng:</h3>
            <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        )}
        
        {sessionData && (
          <div className="mb-4">
            <h3 className="font-medium">Thông tin session:</h3>
            <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
              {JSON.stringify({
                ...sessionData,
                access_token: sessionData.access_token ? '***redacted***' : null,
                refresh_token: sessionData.refresh_token ? '***redacted***' : null,
              }, null, 2)}
            </pre>
          </div>
        )}
        
        {debugInfo && (
          <div className="mb-4">
            <h3 className="font-medium">Thông tin debug từ server:</h3>
            <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div className="flex gap-4">
        {status === 'authenticated' ? (
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Đăng xuất
          </button>
        ) : (
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Đăng nhập
          </button>
        )}
        
        <button 
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Đến Dashboard
        </button>
      </div>
    </div>
  );
} 