import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { fetcher } from '@/lib/coinmarketcap.actions';
import CandlestickChart from '../CandlestickChart';

interface CoinLogoResponse {
  data: Record<string, Array<{ logo?: string }>>;
}

const CoinOverview = async () => {
  try {
    const [coin, coinLogo, coinOHLCData] = await Promise.all([
      fetcher<CoinGeckoDetailsData>('/v1/cryptocurrency/quotes/latest?symbol=BTC'),
      fetcher<CoinLogoResponse>('/v2/cryptocurrency/info?symbol=BTC'),
      fetcher<CoinOHLCDData>(
        `/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=100`,
        undefined,
        60,
        'binance'
      ),
    ]);

    const logoUrl =
      coinLogo.data?.BTC?.[0]?.logo ||
      'https://via.placeholder.com/56x56?text=BTC';
    const btcData = coin.data.BTC;
    const currentPrice = btcData.quote.USD.price;

    return (
      <div id="coin-overview">
        <CandlestickChart data={coinOHLCData} coinId="BTC">
          <div className="header pt-2">
            <Image src={logoUrl} alt="Bitcoin logo" width={56} height={56} />
            <div className="info">
              <p>
                {btcData.name} / {btcData.symbol}
              </p>
              <h1>{formatCurrency(currentPrice)}</h1>
            </div>
          </div>
        </CandlestickChart>
      </div>
    );
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return (
      <div id="coin-overview">
        <div className="header pt-2">
          <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
          <div className="info">
            <p>Bitcoin / BTC</p>
            <h1>$0.00</h1>
          </div>
        </div>
      </div>
    );
  }
};

export default CoinOverview;
