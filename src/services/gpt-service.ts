import { TradeMethod } from '@/types/method';

export const gptService = {
  async analyzeMethod(method: TradeMethod, stats: any) {
    try {
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'analyzeMethod',
          data: { method, stats }
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Lỗi khi phân tích phương pháp:', error);
      return 'Không thể phân tích phương pháp này.';
    }
  },

  async analyzeMarket(pair: string, timeframe: string) {
    try {
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'analyzeMarket',
          data: { pair, timeframe }
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Lỗi khi phân tích thị trường:', error);
      return 'Không thể phân tích thị trường.';
    }
  }
}; 