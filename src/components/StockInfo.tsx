import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZERO } from '@/constants/magicNumbers';
import { formatVolume } from '@/lib/utils';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const FIX_DECIMAL_DIGITS = 2;
interface StockInfoProps {
  data: {
    symbol: string;
    name: string;
    exchange: string;
    currency: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    previous_close: string;
    change: string;
    percent_change: string;
  };
}

export function StockInfo({ data }: StockInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm text-muted-foreground">Exchange</dt>
            <dd className="text-lg font-medium">{data.exchange}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Currency</dt>
            <dd className="text-lg font-medium">{data.currency}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Volume</dt>
            <dd className="text-lg font-medium">
              {formatVolume(Number(data.volume))}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Change</dt>
            <dd
              className={`text-lg font-medium flex items-center gap-1 ${
                Number(data.change) >= ZERO ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {Number(data.change) >= ZERO ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
              {Number(data.change).toFixed(FIX_DECIMAL_DIGITS)} (
              {Number(data.percent_change).toFixed(FIX_DECIMAL_DIGITS)}%)
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
