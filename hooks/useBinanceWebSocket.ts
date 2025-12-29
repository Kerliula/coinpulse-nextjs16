'use client';

import { useEffect, useRef, useState } from 'react';
import { Time } from 'lightweight-charts';

const BINANCE_WEBSOCKET_URL = process.env.NEXT_PUBLIC_BINANCE_WEBSOCKET_URL;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useBinanceWebSocket = ({
  coinId: _,
  poolId,
  liveInterval,
}: UseBinanceWebSocketProps): UseBinanceWebSocketReturn => {
  const wsRef = useRef<WebSocket | null>(null);

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);

  const [isWsReady, setIsWsReady] = useState(false);

  useEffect(() => {
    if (!BINANCE_WEBSOCKET_URL) {
      console.warn('NEXT_PUBLIC_BINANCE_WEBSOCKET_URL is not defined');
      return;
    }

    // Binance uses lowercase symbols for stream names
    const symbol = poolId.toLowerCase();
    
    // Create combined stream URL for multiple streams
    const streams = [
      `${symbol}@trade`,
      `${symbol}@kline_${liveInterval}`,
      `${symbol}@ticker`,
    ].join('/');
    
    const wsUrl = `${BINANCE_WEBSOCKET_URL}/stream?streams=${streams}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      const data = message.data || message;
      
      if (data.e === 'trade') {
        const trade: Trade = {
          price: parseFloat(data.p),
          quantity: parseFloat(data.q),
          tradeId: data.t,
          timestamp: data.T,
        };
        setTrades((prevTrades) => [trade, ...prevTrades].slice(0, 50));
      } else if (data.e === 'kline') {
        const kline = data.k;
        const ohlcData: OHLCData = {
          time: Math.floor(kline.t / 1000) as Time,
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c),
        };
        setOhlcv(ohlcData);
      } else if (data.e === '24hrTicker') {
        const priceData: ExtendedPriceData = {
          usd: parseFloat(data.c),
        };
        setPrice(priceData);
      }
    };
    ws.onopen = () => setIsWsReady(true);
    ws.onmessage = handleMessage;
    ws.onclose = () => setIsWsReady(false);
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsWsReady(false);
    };

    return () => {
      ws.close();
    };
  }, [poolId, liveInterval]);

  return { price, trades, ohlcv, isConnected: isWsReady };
};
