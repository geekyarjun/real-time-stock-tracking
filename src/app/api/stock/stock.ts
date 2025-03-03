export async function getStockData(symbol: string) {
  const response = await fetch(
    `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.NEXT_PUBLIC_STOCK_API_KEY}`,
    { next: { revalidate: 60 } }, // Optional: cache for 1 minute
  );

  if (!response.ok) {
    throw new Error('Failed to fetch stock data');
  }

  return response.json();
}
