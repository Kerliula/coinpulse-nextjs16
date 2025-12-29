'use client';

import { useState } from 'react';
import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';
import CandlestickChart from '@/components/CandlestickChart';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface CoinDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CoinDetailPage({ params }: CoinDetailPageProps) {
  const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1m');
  
  // Unwrap params
  const unwrappedParams = use(params);
  const coinId = unwrappedParams.id || 'bitcoin';
  const poolId = 'BTCUSDT';

  const { price, trades, ohlcv, isConnected } = useBinanceWebSocket({
    coinId,
    poolId,
    liveInterval,
  });

  return (
    <main className="main-container">
      <div className="w-full space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold capitalize">{coinId}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-sm px-2 py-1 rounded ${isConnected ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                {isConnected ? '● Live' : '● Disconnected'}
              </span>
              <span className="text-sm text-muted-foreground">
                Pool: {poolId}
              </span>
            </div>
          </div>
          
          {/* Interval Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setLiveInterval('1s')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                liveInterval === '1s'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              1s
            </button>
            <button
              onClick={() => setLiveInterval('1m')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                liveInterval === '1m'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              1m
            </button>
          </div>
        </div>

        {/* Price Card */}
        {price && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-6 border">
              <p className="text-sm text-muted-foreground mb-2">Current Price</p>
              <p className="text-2xl font-bold">
                {formatCurrency(price.usd)}
              </p>
            </div>
            
            {price.change24h !== undefined && (
              <div className="bg-card rounded-lg p-6 border">
                <p className="text-sm text-muted-foreground mb-2">24h Change</p>
                <p className={`text-2xl font-bold ${price.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {price.change24h >= 0 ? '+' : ''}{price.change24h.toFixed(2)}%
                </p>
              </div>
            )}

            {price.volume24h !== undefined && (
              <div className="bg-card rounded-lg p-6 border">
                <p className="text-sm text-muted-foreground mb-2">24h Volume</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(price.volume24h)}
                </p>
              </div>
            )}

            {price.marketCap !== undefined && (
              <div className="bg-card rounded-lg p-6 border">
                <p className="text-sm text-muted-foreground mb-2">Market Cap</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(price.marketCap)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Chart Section */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
          <CandlestickChart
            coinId={coinId}
            liveOhlcv={ohlcv}
            mode="live"
            liveInterval={liveInterval}
            setLiveInterval={setLiveInterval}
            height={400}
          />
        </div>

        {/* OHLC Data */}
        {ohlcv && (
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4">OHLC Data</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-lg font-semibold">{formatCurrency(ohlcv.open)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High</p>
                <p className="text-lg font-semibold text-green-500">{formatCurrency(ohlcv.high)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low</p>
                <p className="text-lg font-semibold text-red-500">{formatCurrency(ohlcv.low)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Close</p>
                <p className="text-lg font-semibold">{formatCurrency(ohlcv.close)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Range</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(ohlcv.high - ohlcv.low)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Trades */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Recent Trades (Last 50)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {trades.length > 0 ? (
                  trades.map((trade, index) => (
                    <tr 
                      key={trade.tradeId || index} 
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm">
                        {trade.timestamp ? new Date(trade.timestamp).toLocaleTimeString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-medium">
                        {formatCurrency(trade.price)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        {formatNumber(trade.quantity)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-medium">
                        {formatCurrency((trade.price || 0) * (trade.quantity || 0))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      No trades available yet. Waiting for live data...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

// Import React's use hook for unwrapping promises
import { use } from 'react';
