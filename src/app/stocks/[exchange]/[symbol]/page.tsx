import { Suspense } from 'react';
import { getStockData } from '@/lib/api';

import { StockPageClient } from './StockPageClient';

interface Props {
  params: Promise<{ symbol: string; exchange: string }>;
}

// Server Component
export default async function StockPage({ params }: Props) {
  const { symbol, exchange } = await params;

  // Initial server-side data fetch
  const initialStockData = await getStockData(symbol);

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
