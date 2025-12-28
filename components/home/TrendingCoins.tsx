import { fetcher } from '@/lib/coinmarketcap.actions';
import Link from 'next/link';
import cn from 'clsx';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { DataTable } from '@/components/DataTable';

interface CoinData {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
    };
  };
}

const columns: DataTableColumn<CoinData>[] = [
  {
    header: 'Name',
    cellClassName: 'name-cell',
    cell: (coin: CoinData) => <Link href={`/coins/${coin.id}`}>{coin.name}</Link>,
  },
  {
    header: '24h Change',
    cellClassName: 'change-cell',
    cell: (coin: CoinData) => {
      const change = coin.quote.USD.percent_change_24h;
      const isPositive = change > 0;
      const isNeutral = change === 0;
      return (
        <div
          className={cn(
            'price-change flex items-center gap-1',
            isPositive ? 'text-green-500' : isNeutral ? 'text-gray-500' : 'text-red-500'
          )}
        >
          {isPositive && <TrendingUp width={16} height={16} />}
          {!isPositive && !isNeutral && <TrendingDown width={16} height={16} />}
          <span>{change.toFixed(2)}%</span>
        </div>
      );
    },
  },
  {
    header: 'Price',
    cellClassName: 'price-cell',
    cell: (coin: CoinData) => {
      const price = coin.quote.USD.price;
      if (price < 0.01) {
        return `${price.toFixed(6)}`;
      } else if (price < 1) {
        return `${price.toFixed(4)}`;
      } else {
        return `${price.toFixed(2)}`;
      }
    },  },
];

const TrendingCoins = async () => {
  try {
    const response = await fetcher<{ data: CoinData[] }>(
      '/v1/cryptocurrency/listings/latest',
      undefined,
      5000 
    );
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format');
    }
    
    const trendingCoinsData = response.data.slice(0, 6);
    
    return (
      <div id="trending-coins">
        <h2 className='text-xl text-center font-bold mb-4'>Trending Coins</h2>
        <DataTable
          columns={columns}
          data={trendingCoinsData}
          rowKey={(row) => row.id}
          tableClassName="trending-coins-table"
          headerCellClassName="py-3!"
          bodyCellClassName="py-2!"
        />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch trending coins:', error);
    return (
      <div id="trending-coins">
        <h2 className='text-xl text-center font-bold mb-4'>Trending Coins</h2>
        <p className='text-center text-gray-500'>Unable to load trending coins at this time.</p>
      </div>
    );
  }
};
export default TrendingCoins;
