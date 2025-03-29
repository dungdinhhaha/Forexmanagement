document.getElementById('grabData').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  
  try {
    // Lấy tab hiện tại
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Kiểm tra xem có phải trang TradingView không
    if (!tab.url.includes('tradingview.com')) {
      throw new Error('Vui lòng mở TradingView để sử dụng extension');
    }

    // Inject script để lấy dữ liệu
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        try {
          // Kiểm tra xem là long hay short position
          const isLong = document.querySelector('input[data-property-id="Risk/RewardlongEntryPrice"]') !== null;
          const prefix = isLong ? 'long' : 'short';

          // Lấy entry price từ input cụ thể
          const entryInput = document.querySelector(`input[data-property-id="Risk/Reward${prefix}EntryPrice"]`);
          const entryPrice = entryInput ? parseFloat(entryInput.value) : 0;

          // Lấy lot size
          const lotInput = document.querySelector('input[data-name="lot-size-input"]');
          const lotSize = lotInput ? parseFloat(lotInput.value) : 1;

          // Lấy profit price từ input cụ thể
          const profitInput = document.querySelector(`input[data-property-id="Risk/Reward${prefix}ProfitLevelPrice"]`);
          const profitPrice = profitInput ? parseFloat(profitInput.value) : 0;

          // Lấy stop loss từ input cụ thể
          const stopInput = document.querySelector(`input[data-property-id="Risk/Reward${prefix}StopLevelPrice"]`);
          const stopPrice = stopInput ? parseFloat(stopInput.value) : 0;

          // Lấy tên cặp tiền từ header
          const symbolElement = document.querySelector('[data-name="legend-series-item"]');
          const pair = symbolElement ? symbolElement.textContent.trim() : '';

          // Lấy timeframe
          const timeframeElement = document.querySelector('[data-name="time-interval-button"]');
          const timeframe = timeframeElement ? timeframeElement.textContent.trim() : '';

          // Tính profit dựa vào loại lệnh
          const profit = profitPrice && entryPrice ? 
            (isLong ? 
              ((profitPrice - entryPrice) * lotSize * 100000) : 
              ((entryPrice - profitPrice) * lotSize * 100000)
            ).toFixed(2) : 0;

          console.log('Found values:', {
            isLong,
            entryPrice,
            lotSize,
            profitPrice,
            stopPrice,
            pair,
            timeframe
          });

          return {
            success: true,
            data: {
              pair,
              type: isLong ? 'BUY' : 'SELL',
              entry_price: entryPrice,
              exit_price: profitPrice,
              quantity: lotSize,
              profit: parseFloat(profit),
              date: new Date().toISOString().split('T')[0],
              note: `${timeframe} - Risk 25% - TP: ${profitPrice} - SL: ${stopPrice}`,
              method_id: '',
              screenshot: ''
            }
          };
        } catch (error) {
          console.error('Error in content script:', error);
          return { success: false, error: error.message };
        }
      }
    });

    const response = result[0].result;
    
    if (response.success) {
      // Copy dữ liệu vào clipboard
      await navigator.clipboard.writeText(JSON.stringify(response.data));
      
      statusDiv.textContent = 'Đã copy dữ liệu!';
      statusDiv.className = 'success';
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error('Extension error:', error);
    statusDiv.textContent = error.message;
    statusDiv.className = 'error';
  }
}); 