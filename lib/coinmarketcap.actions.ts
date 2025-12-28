'use server';

import qs from 'query-string';

type QueryParams = Record<string, string | number | boolean | undefined>;

const COINMARKETCAP_API_URL = process.env.COINMARKETCAP_API_URL;
const BINANSE_API_URL = process.env.BINANCE_API_URL;

const API_KEY = process.env.COINMARKETCAP_API_KEY;

if (!COINMARKETCAP_API_URL || !API_KEY || !BINANSE_API_URL) {
  throw new Error('API URL or API Key is not defined in environment variables');
}

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
  api: 'binance' | 'coinmarketcap' = 'coinmarketcap'
): Promise<T> {
  const BASE_URL =
    api === 'coinmarketcap' ? COINMARKETCAP_API_URL : BINANSE_API_URL;

  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true }
  );

  const headers: Record<string, string> = api === 'coinmarketcap'
    ? {
        'X-CMC_PRO_API_KEY': API_KEY!,
        'content-type': 'application/json',
      }
    : {
        'content-type': 'application/json',
      };

  const response = await fetch(url, {
    method: 'GET',
    headers,
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
