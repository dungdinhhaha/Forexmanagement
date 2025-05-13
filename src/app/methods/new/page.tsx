'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateMethodPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    rules: '',
    indicators: '',
    timeframes: '',
    recommendations: '',
    total_trades: 0,
    win_trades: 0,
    lose_trades: 0,
    draw_trades: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/methods/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          rules: form.rules.split('\n').map(r => r.trim()).filter(Boolean),
          indicators: form.indicators.split(',').map(i => i.trim()).filter(Boolean),
          timeframes: form.timeframes.split(',').map(t => t.trim()).filter(Boolean),
          recommendations: form.recommendations
            ? form.recommendations.split('\n').map(r => r.trim()).filter(Boolean)
            : [],
          total_trades: form.total_trades,
          win_trades: form.win_trades,
          lose_trades: form.lose_trades,
          draw_trades: form.draw_trades,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/methods');
      } else {
        setError(data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Tạo phương pháp mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Tên phương pháp</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Quy tắc (mỗi dòng 1 quy tắc)</label>
          <textarea
            name="rules"
            value={form.rules}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Indicators (cách nhau bởi dấu phẩy)</label>
          <input
            name="indicators"
            value={form.indicators}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Timeframes (cách nhau bởi dấu phẩy)</label>
          <input
            name="timeframes"
            value={form.timeframes}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Khuyến nghị (mỗi dòng 1 đề xuất, có thể bỏ trống)</label>
          <textarea
            name="recommendations"
            value={form.recommendations}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Tổng số lệnh</label>
            <input
              type="number"
              name="total_trades"
              value={form.total_trades}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min={0}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Lệnh thắng</label>
            <input
              type="number"
              name="win_trades"
              value={form.win_trades}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min={0}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Lệnh thua</label>
            <input
              type="number"
              name="lose_trades"
              value={form.lose_trades}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min={0}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Lệnh hòa</label>
            <input
              type="number"
              name="draw_trades"
              value={form.draw_trades}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min={0}
            />
          </div>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Đang tạo...' : 'Tạo phương pháp'}
        </button>
      </form>
    </div>
  );
} 