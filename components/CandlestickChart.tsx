'use client';

import { getChartConfig, PERIOD_BUTTONS } from '@/constants';
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
} from 'lightweight-charts';
import { useEffect, useRef, useState, useTransition } from 'react';
import { fetcher } from '@/lib/coinmarketcap.actions';
import { PERIOD_CONFIG, getCandlestickConfig } from '@/constants';
import { convertOHLCData } from '@/lib/utils';

const CandlestickChart = ({
  children,
  data,
  coinId,
  height = 360,
  initialPeriod = 'daily',
}: CandlestickChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(
    data && Array.isArray(data) && data.length > 0 && Array.isArray(data[0])
      ? convertOHLCData(data as (string | number)[][])
      : ((data as OHLCData[]) ?? [])
  );
  const [isPending, startTransition] = useTransition();

  const fetchOHLCData = async (selectedPeriod: Period) => {
    setLoading(true);
    try {
      const config = PERIOD_CONFIG[selectedPeriod];

      const newData = await fetcher<CoinOHLCDData>(
        `/api/v3/klines?symbol=${coinId}USDT&interval=${config.interval}&limit=100`,
        undefined,
        60,
        'binance'
      );

      setOhlcData(convertOHLCData(newData ?? []));
    } catch (error) {
      console.error('Error fetching OHLC data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod: string) => {
    if (newPeriod === period) return;

    startTransition(async () => {
      setPeriod(newPeriod as Period);
      await fetchOHLCData(newPeriod as Period);
    });
  };

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const showTime = ['daily', 'weekly', 'monthly'].includes(period);

    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    });
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    chart.timeScale().fitContent();

    chartRef.current = chart;
    candleSeriesRef.current = series;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;

      chart.applyOptions({ width: entries[0].contentRect.width });
      observer.observe(container);

      return () => {
        observer.disconnect();
        chart.remove();
        chartRef.current = null;
        candleSeriesRef.current = null;
      };
    });
  }, [height]);

  useEffect(() => {
    if (!candleSeriesRef.current) return;

    candleSeriesRef.current.setData(ohlcData);
    chartRef.current?.timeScale().fitContent();
  }, [ohlcData, period]);

  return (
    <div id="candlestick-chart">
      <div className="chart-header">
        <div className="flex-1">{children}</div>

        <div className="button-group">
          <span className="text-sm mx-2 font-medium text-purple-100/50">
            Period:
          </span>
          {PERIOD_BUTTONS.map((button) => (
            <button
              key={button.value}
              className={
                period === button.value
                  ? 'config-button-active'
                  : 'config-button'
              }
              onClick={() => handlePeriodChange(button.value)}
              disabled={loading || isPending}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={chartContainerRef} className="chart" style={{ height }} />
    </div>
  );
};

export default CandlestickChart;
