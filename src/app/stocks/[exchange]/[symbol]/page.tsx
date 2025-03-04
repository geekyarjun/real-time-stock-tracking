import { Suspense } from 'react';
import { fetchStockData } from '@/services/stock';

import { StockPageClient } from './StockPageClient';

interface Props {
  params: Promise<{ symbol: string; exchange: string }>;
}

// Server Component
export default async function StockPage({ params }: Props) {
  const { symbol, exchange } = await params;

  // Initial server-side data fetch
  const initialStockData = await fetchStockData(symbol, {
    next: { revalidate: 60 },
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <StockPageClient
          symbol={symbol}
          exchange={exchange}
          initialStockData={initialStockData}
        />
      </Suspense>
    </div>
  );
}
