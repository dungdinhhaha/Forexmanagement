import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export class PsychologyService {
  private supabase = createClientComponentClient();
  
  // Các phương thức sẽ được thêm sau
  async getPsychologyEntries() {
    // Triển khai sau
    return [];
  }
  
  // Thêm các phương thức khác khi cần
}

export const psychologyService = new PsychologyService(); 