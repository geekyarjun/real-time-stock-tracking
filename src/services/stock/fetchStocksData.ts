import { Stock } from './types';

export async function fetchStockData(
  symbol: string,
  options?: RequestInit & { next?: { revalidate?: number } },
): Promise<Stock> {
  const API_KEY = process.env.TWELVE_DATA_API_KEY;
  const BASE_URL = process.env.TWELVE_DATA_BASE_URL;

  if (!API_KEY || !BASE_URL) {
    throw new Error('Missing required environment variables.');
  }

  const url = `${BASE_URL}/quote?symbol=${symbol}&apikey=${API_KEY}`;

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error('Failed to fetch stock data');
  }

  return response.json();
}
