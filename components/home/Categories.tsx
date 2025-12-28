import { DataTable } from '@/components/DataTable';
import { fetcher } from '@/lib/coinmarketcap.actions';
import cn from 'clsx';
import { TrendingDown, TrendingUp } from 'lucide-react';

const Categories = async () => {
  const categoriesData = await fetcher('/v1/cryptocurrency/categories');

  const columns: DataTableColumn<any>[] = [
    {
      header: 'Category',
      cellClassName: 'category-cell',
      cell: (category) => category.name,
    },
    {
      header: 'Market Cap',
      cellClassName: 'marketcap-cell',
      cell: (category) => {
        const marketCap = category.market_cap;
        if (marketCap >= 1e12) {
          return `$${(marketCap / 1e12).toFixed(2)}T`;
        } else if (marketCap >= 1e9) {
          return `$${(marketCap / 1e9).toFixed(2)}B`;
        } else if (marketCap >= 1e6) {
          return `$${(marketCap / 1e6).toFixed(2)}M`;
        } else if (marketCap >= 1e3) {
          return `$${(marketCap / 1e3).toFixed(2)}K`;
        }
        return `$${marketCap.toFixed(2)}`;
      },
    },
    {
      header: 'Market Cap Change',
      cellClassName: 'percentchange-cell',
      cell: (category) => {
        const change = category.market_cap_change;
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
            <span>{change?.toFixed(2)}%</span>
          </div>
        );
      }
    },
    {
      header: "Last Updated",
      cellClassName: 'updated-cell',
      cell: (category) => new Date(category.last_updated).toLocaleDateString(),
    }
  ];

  return (
    <div id="categories" className="custom-scrollbar">
      <h4>Top Categories</h4>
      <DataTable
        columns={columns}
        data={categoriesData?.data.slice(0, 10)}
        rowKey={(_, index) => index}
        tableClassName="mt-3"
      />
    </div>
  );
};

export default Categories;
