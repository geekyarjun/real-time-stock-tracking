import { QueryKey, UseQueryOptions, useQuery } from '@tanstack/react-query';

import { Stock } from './types';

export const fetchStockFromAPI = async (symbol: string) => {
  const res = await fetch(`/api/stock?symbol=${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch stock data');
  return res.json();
};

// Extend `useQuery` options with proper type inference
export function useFetchStockData<TData = Stock>(
  symbol: string,
  options?: Omit<
    UseQueryOptions<TData, Error, TData, QueryKey>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery<TData, Error>({
    queryKey: ['stock', symbol],
    queryFn: () => fetchStockFromAPI(symbol) as Promise<TData>,
    ...options, // Spread additional options
  });
}
