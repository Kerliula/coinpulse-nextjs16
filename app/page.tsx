'use client';

import CoinOverview from '@/components/home/CoinOverview';
import TrendingCoins from '@/components/home/TrendingCoins';
import { Suspense } from 'react';
import {
  CoinOverviewFallback,
  TrendingCoinsFallback,
  CategoriesFallback,
} from '@/components/fallback';
import Categories from '@/components/home/Categories';
import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';

const Page = () => {
  const { price, trades, ohlcv } = useBinanceWebSocket({
    coinId: 'bitcoin',
    poolId: 'default',
    liveInterval: '1m',
  });

  console.log('Live Price Data:', price);
  console.log('Recent Trades:', trades);
  console.log('OHLCV Data:', ohlcv);

  return (
    <main className="main-container">
      <section className="home-grid">
        <Suspense fallback={<CoinOverviewFallback />}>
          <CoinOverview />
        </Suspense>

        <Suspense fallback={<TrendingCoinsFallback />}>
          <TrendingCoins />
        </Suspense>
      </section>

      <section className="w-full mt-7 space-y-4">
        <Suspense fallback={<CategoriesFallback />}>
          <Categories />
        </Suspense>
      </section>
    </main>
  );
};
export default Page;
