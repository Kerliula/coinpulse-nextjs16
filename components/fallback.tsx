import { DataTable, type DataTableColumn } from '@/components/DataTable';

interface SkeletonData {
  id: number;
}

const skeletonColumns: DataTableColumn<SkeletonData>[] = [
  {
    header: 'Name',
    cellClassName: 'name-cell',
    cell: () => (
      <div className="name-link">
        <div className="name-image bg-gray-300 animate-pulse rounded-full"></div>
        <div className="name-line bg-gray-300 animate-pulse rounded"></div>
      </div>
    ),
  },
  {
    header: '24h Change',
    cellClassName: 'change-cell',
    cell: () => (
      <div className="price-change">
        <div className="change-icon bg-gray-300 animate-pulse rounded-full"></div>
        <div className="change-line bg-gray-300 animate-pulse rounded"></div>
      </div>
    ),
  },
  {
    header: 'Price',
    cellClassName: 'price-cell',
    cell: () => <div className="price-line bg-gray-300 animate-pulse rounded"></div>,
  },
];

const skeletonData: SkeletonData[] = Array.from({ length: 6 }, (_, i) => ({ id: i }));

export const CoinOverviewFallback = () => (
  <div id="coin-overview-fallback">
    <div className="header">
      <div className="header-image bg-gray-300 animate-pulse rounded-full"></div>
      <div className="info">
        <div className="header-line-sm bg-gray-300 animate-pulse rounded"></div>
        <div className="header-line-lg bg-gray-300 animate-pulse rounded"></div>
      </div>
    </div>
    <div className="chart">
      <div className="chart-skeleton bg-gray-300 animate-pulse rounded-xl"></div>
    </div>
  </div>
);

export const TrendingCoinsFallback = () => (
  <div id="trending-coins-fallback">
    <h4>Trending Coins</h4>
    <div className="trending-coins-table">
      <DataTable
        columns={skeletonColumns}
        data={skeletonData}
        rowKey={(row) => row.id}
      />
    </div>
  </div>
);