import { NextRequest, NextResponse } from 'next/server';
import { methodService } from '@/services/server/method.service';
import { CreateMethodDto, UpdateMethodDto } from '@/models/method.model';

export class MethodController {
  // Xác thực người dùng
  async authenticate() {
    return methodService.authenticate();
  }
  
  // Lấy tất cả phương pháp
  async getAllMethods(request: NextRequest) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      const methods = await methodService.getAllMethods(auth.userId!);
      return NextResponse.json(methods);
    } catch (error) {
      console.error('Controller error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  // Lấy phương pháp theo ID
  async getMethodById(id: string) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      const method = await methodService.getMethodById(id, auth.userId!);
      
      if (!method) {
        return NextResponse.json({ error: 'Method not found' }, { status: 404 });
      }
      
      return NextResponse.json(method);
    } catch (error) {
      console.error('Controller error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  // Tạo phương pháp mới
  async createMethod(request: NextRequest) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      const body = await request.json();
      
      // Validate required fields
      if (!body.name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
      }
      
      const methodData: CreateMethodDto = {
        name: body.name,
        description: body.description || '',
        rules: body.rules || [],
        indicators: body.indicators || [],
        timeframes: body.timeframes || []
      };
      
      const newMethod = await methodService.createMethod(methodData, auth.userId!);
      return NextResponse.json(newMethod, { status: 201 });
    } catch (error) {
      console.error('Controller error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  // Cập nhật phương pháp
  async updateMethod(id: string, request: NextRequest) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      const body = await request.json();
      
      // Check if method exists and belongs to user
      const existingMethod = await methodService.getMethodById(id, auth.userId!);
      if (!existingMethod) {
        return NextResponse.json({ error: 'Method not found' }, { status: 404 });
      }
      
      const methodData: UpdateMethodDto = {};
      if (body.name !== undefined) methodData.name = body.name;
      if (body.description !== undefined) methodData.description = body.description;
      if (body.rules !== undefined) methodData.rules = body.rules;
      if (body.indicators !== undefined) methodData.indicators = body.indicators;
      if (body.timeframes !== undefined) methodData.timeframes = body.timeframes;
      
      const updatedMethod = await methodService.updateMethod(id, methodData, auth.userId!);
      return NextResponse.json(updatedMethod);
    } catch (error) {
      console.error('Controller error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  // Xóa phương pháp
  async deleteMethod(id: string) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      // Check if method exists and belongs to user
      const existingMethod = await methodService.getMethodById(id, auth.userId!);
      if (!existingMethod) {
        return NextResponse.json({ error: 'Method not found' }, { status: 404 });
      }
      
      await methodService.deleteMethod(id, auth.userId!);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Controller error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  // Lấy thống kê phương pháp
  async getMethodStats(id: string) {
    try {
      const auth = await this.authenticate();
      
      if (!auth.authenticated) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }
      
      // Check if method exists and belongs to user
      const existingMethod = await methodService.getMethodById(id, auth.userId!);
      if (!existingMethod) {
        return NextResponse.json({ error: 'Method not found' }, { status: 404 });
      }
      
      const stats = await methodService.getMethodStats(id, auth.userId!);
      return NextResponse.json(stats);
    } catch (error) {
      console.error('Controller error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}

export const methodController = new MethodController(); 