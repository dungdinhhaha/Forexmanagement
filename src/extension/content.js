// Lắng nghe message từ popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'grabData') {
    try {
      // Lấy tên cặp tiền
      const symbolElement = document.querySelector('[data-name="legend-series-item"]');
      const pair = symbolElement ? symbolElement.textContent.trim() : '';

      // Lấy timeframe
      const timeframeElement = document.querySelector('[data-name="time-interval-button"]');
      const timeframe = timeframeElement ? timeframeElement.textContent.trim() : '';

      // Lấy giá hiện tại
      const priceElement = document.querySelector('[data-name="price-axis-last-price"]');
      const currentPrice = priceElement ? parseFloat(priceElement.textContent.trim()) : 0;

      // Kiểm tra màu để xác định loại lệnh
      const chartElement = document.querySelector('.chart-markup-table');
      const computedStyle = window.getComputedStyle(chartElement);
      const backgroundColor = computedStyle.backgroundColor;
      // Giả sử màu xanh có RGB thấp hơn màu đỏ
      const type = backgroundColor.includes('rgb(0,') ? 'BUY' : 'SELL';

      const data = {
        pair,
        type,
        entry_price: currentPrice, // Tạm thời lấy giá hiện tại
        exit_price: currentPrice,
        quantity: 1,
        profit: 0,
        date: new Date().toISOString().split('T')[0],
        note: `${timeframe} - Auto grabbed from TradingView`,
        method_id: '',
        screenshot: ''
      };

      sendResponse({ success: true, data });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  return true; // Giữ kết nối để async
}); 