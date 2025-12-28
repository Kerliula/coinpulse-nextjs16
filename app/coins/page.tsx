import { DataTable } from '@/components/DataTable';
import { fetcher } from '@/lib/coinmarketcap.actions';
import cn from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { formatPercentage, formatCurrency } from '@/lib/utils';
import CoinsPagination from '@/components/CoinsPagination';

const columns: DataTableColumn<CoinMarketData>[] = [
  {
    header: 'Rank',
    cellClassName: 'rank-cell',
    cell: (coin) => (
      <>
        #{coin.market_cap_rank}
        <Link href={`/coins/${coin.id}`} aria-label="View coin" />
      </>
    ),
  },
  {
    header: 'Token',
    cellClassName: 'token-cell',
    cell: (coin) => (
      <div className="token-info">
        <Image src={coin.image} alt={coin.name} width={36} height={36} />
        <p>
          {coin.name} ({coin.symbol.toUpperCase()})
        </p>
      </div>
    ),
  },
  {
    header: 'Price',
    cellClassName: 'price-cell',
    cell: (coin) => formatCurrency(coin.current_price),
  },
  {
    header: '24h Change',
    cellClassName: 'change-cell',
    cell: (coin) => {
      const isTrendingUp = coin.price_change_percentage_24h > 0;

      return (
        <span
          className={cn('change-value', {
            'text-green-600': isTrendingUp,
            'text-red-500': !isTrendingUp,
          })}
        >
          {isTrendingUp && '+'}
          {formatPercentage(coin.price_change_percentage_24h)}
        </span>
      );
    },
  },
  {
    header: 'Market Cap',
    cellClassName: 'market-cap-cell',
    cell: (coin) => formatCurrency(coin.market_cap),
  },
];

const Coins = async ({ searchParams }: NextPageProps) => {
  const { page } = await searchParams;

  const currentPage = page ? parseInt(page as string, 10) : 1;
  const perPage = 10;

  const coinsData = await fetcher(
    `/v1/cryptocurrency/listings/latest?limit=${perPage}&start=${(currentPage - 1) * perPage + 1}`
  );

  const hasMorePages = coinsData?.data.length > currentPage * perPage;
  const estimatedPages =
    currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100;

  const adjustedCoins = coinsData.data.map((coin: any) => ({
    id: coin.slug,
    market_cap_rank: coin.cmc_rank,
    name: coin.name,
    symbol: coin.symbol,
    current_price: coin.quote.USD.price,
    price_change_percentage_24h: coin.quote.USD.percent_change_24h,
    market_cap: coin.quote.USD.market_cap,
    image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
  }));

  return (
    <main id="coins-page">
      <div className="content">
        <h4>All Coins</h4>

        <DataTable
          tableClassName="coins-table"
          columns={columns}
          data={adjustedCoins}
          rowKey={(coin) => coin.id}
        />
        <CoinsPagination
          currentPage={currentPage}
          totalPages={estimatedPages}
          hasMorePages={hasMorePages}
        />
      </div>
    </main>
  );
};

export default Coins;
