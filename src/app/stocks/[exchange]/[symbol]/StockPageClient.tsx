"use client";

import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/lib/store";
import { StockInfo } from "@/components/StockInfo";
import { TokenChart } from "@/components/TokenChart";
import { WatchlistButton } from "@/components/WatchlistButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  symbol: string;
  exchange: string;
  initialStockData: any; // I will update the type according to the API response
}

export function StockPageClient({ symbol, exchange, initialStockData }: Props) {
  const { toast } = useToast();
  const { user } = useStore();

  // Client-side polling for price updates
  const { data: stockData } = useQuery({
    queryKey: ["stock", symbol],
    queryFn: async () => {
      const response = await fetch(
        `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.NEXT_PUBLIC_STOCK_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "error") {
        toast({
          variant: "destructive",
          title: "Error fetching stock data",
          description: data.message || "Something went wrong",
        });
        throw new Error(data.message);
      }

      return data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    initialData: initialStockData, // Use server-fetched data as initial data
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{stockData?.symbol}</h1>
          <p className="text-muted-foreground">{stockData?.name}</p>
        </div>
        {user && <WatchlistButton symbol={symbol} exchange={exchange} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Price Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <TokenChart
              className="border-0 p-0"
              data={{
                exchange,
                symbol,
              }}
            />
          </CardContent>
        </Card>

        <StockInfo data={stockData} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardContent className="pt-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg border bg-card/50">
                  <dt className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                    Open
                  </dt>
                  <dd className="text-2xl font-bold mt-1">
                    ${Number(stockData?.open).toFixed(2)}
                  </dd>
                </div>
                <div className="p-4 rounded-lg border bg-card/50">
                  <dt className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
                    Previous Close
                  </dt>
                  <dd className="text-2xl font-bold mt-1">
                    ${Number(stockData?.previous_close).toFixed(2)}
                  </dd>
                </div>
                <div className="p-4 rounded-lg border bg-card/50">
                  <dt className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                    Day High
                  </dt>
                  <dd className="text-2xl font-bold mt-1">
                    ${Number(stockData?.high).toFixed(2)}
                  </dd>
                </div>
                <div className="p-4 rounded-lg border bg-card/50">
                  <dt className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-400"></span>
                    Day Low
                  </dt>
                  <dd className="text-2xl font-bold mt-1">
                    ${Number(stockData?.low).toFixed(2)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analysis">
          {/* We can add technical analysis content here */}
        </TabsContent>
        <TabsContent value="news">
          {/* We can add news content here */}
        </TabsContent>
      </Tabs>
    </>
  );
}
