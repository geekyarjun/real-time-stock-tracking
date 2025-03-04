import { NextRequest, NextResponse } from 'next/server';
import { fetchStockData } from '@/services/stock';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || '';

    const data = await fetchStockData(symbol);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 },
    );
  }
}
