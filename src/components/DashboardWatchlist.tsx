'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZERO } from '@/constants/magicNumbers';
import { useStore } from '@/store/store';
import { formatVolume } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownIcon, ArrowUpIcon, Star } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { fetchStockFromAPI } from '@/services/stock/useFetchStockData';

const FIX_DECIMAL_DIGITS = 2;

export default function DashboardWatchlist() {
  const { user, watchlist = [] } = useStore();

  // Create a stable query key using the symbols and exchange
  const watchlistSymbols = useMemo(
    () =>
      watchlist
        .map((item) => `${item.symbol}-${item.exchange}`)
        .sort()
        .join(','),
    [watchlist],
  );

  // Fetch data for all watchlisted stocks
  const { data: stocksData } = useQuery({
    queryKey: ['watchlist-stocks', watchlistSymbols],
    queryFn: async () => {
      if (watchlist.length === ZERO) return [];

      // Batch fetch all watchlisted stocks
      const promises = watchlist.map(async (stock) => {
        try {
          const data = await fetchStockFromAPI(stock.symbol);
          return { symbol: stock.symbol, ...data };
        } catch (error) {
          console.error(`Error fetching ${stock.symbol}:`, error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      return results.filter(Boolean); // Remove any failed fetches
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    enabled: watchlist.length > ZERO, // Only fetch if there are watchlisted stocks
  });

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please login to create and view your watchlist
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-current" /> Watchlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        {watchlist.length === ZERO ? (
          <p className="text-sm text-muted-foreground">
            Your watchlist is empty. Add stocks to track them here.
          </p>
        ) : (
          <div className="space-y-4">
            {stocksData?.map((stock) => (
              <Link
                key={stock.symbol}
                href={`/stocks/${stock.exchange}/${stock.symbol}`}
                className="block"
              >
                <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div>
                    <h3 className="font-semibold">{stock.symbol}</h3>
                    <p className="text-sm text-muted-foreground">
                      {stock.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      ${Number(stock.open).toFixed(FIX_DECIMAL_DIGITS)}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        Number(stock.change) >= ZERO
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {Number(stock.change) >= ZERO ? (
                        <ArrowUpIcon className="h-3 w-3" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3" />
                      )}
                      {Number(stock.change).toFixed(FIX_DECIMAL_DIGITS)} (
                      {Number(stock.percent_change).toFixed(FIX_DECIMAL_DIGITS)}
                      %)
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Vol: {formatVolume(Number(stock.volume))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
