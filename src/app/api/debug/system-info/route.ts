import { NextResponse } from 'next/server';
import os from 'os';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Lấy thông tin phần cứng
    const systemInfo = {
      hostname: os.hostname(),
      platform: os.platform(),
      release: os.release(),
      type: os.type(),
      arch: os.arch(),
      cpus: os.cpus().length,
      totalMemory: Math.round(os.totalmem() / (1024 * 1024 * 1024) * 100) / 100 + ' GB',
      freeMemory: Math.round(os.freemem() / (1024 * 1024 * 1024) * 100) / 100 + ' GB',
      uptime: Math.floor(os.uptime() / 3600) + ' hours',
    };

    // Lấy thông tin Node.js
    const nodeInfo = {
      version: process.version,
      env: process.env.NODE_ENV,
    };

    // Lấy thông tin process
    const processInfo = {
      pid: process.pid,
      ppid: process.ppid,
      title: process.title,
      cwd: process.cwd(),
      memoryUsage: {
        rss: Math.round(process.memoryUsage().rss / (1024 * 1024) * 100) / 100 + ' MB',
        heapTotal: Math.round(process.memoryUsage().heapTotal / (1024 * 1024) * 100) / 100 + ' MB',
        heapUsed: Math.round(process.memoryUsage().heapUsed / (1024 * 1024) * 100) / 100 + ' MB',
        external: Math.round(process.memoryUsage().external / (1024 * 1024) * 100) / 100 + ' MB',
      },
    };

    // Lấy thông tin về HTTP request
    const requestInfo = {
      timestamp: new Date().toISOString(),
    };

    // Lấy thông tin phiên bản ứng dụng
    const appInfo = {
      name: 'QLPP Web',
      nextVersion: process.env.NEXT_VERSION || 'unknown',
      buildId: process.env.NEXT_BUILD_ID || 'development',
    };

    return NextResponse.json({
      status: 'success',
      systemInfo,
      nodeInfo,
      processInfo,
      requestInfo,
      appInfo,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV || 'not_vercel',
        VERCEL_URL: process.env.VERCEL_URL || 'localhost',
        VERCEL_REGION: process.env.VERCEL_REGION || 'local',
      }
    });
  } catch (error) {
    console.error('Error retrieving system information:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to retrieve system information',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 