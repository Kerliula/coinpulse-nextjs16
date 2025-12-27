'use server';

import qs from 'query-string';

type QueryParams = Record<string, string | number | boolean | undefined>;

const BASE_URL = process.env.COINMARKETCAP_API_URL;
const API_KEY = process.env.COINMARKETCAP_API_KEY;

if (!BASE_URL || !API_KEY) {
  throw new Error('CoinMarketCap API URL or API Key is not defined');
}

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true }
  );

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-CMC_PRO_API_KEY': API_KEY,
      'content-type': 'application/json',
    } as Record<string, string>,
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
