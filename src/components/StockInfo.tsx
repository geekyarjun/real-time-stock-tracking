import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZERO } from '@/constants/magicNumbers';
import { formatVolume } from '@/lib/utils';
import { Stock } from '@/services/stock/types';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const FIX_DECIMAL_DIGITS = 2;

export function StockInfo({ data }: { data?: Stock }) {
  const { exchange, currency, volume, change, percent_change } = data || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm text-muted-foreground">Exchange</dt>
            <dd className="text-lg font-medium">{exchange}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Currency</dt>
            <dd className="text-lg font-medium">{currency}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Volume</dt>
            <dd className="text-lg font-medium">
              {formatVolume(Number(volume))}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Change</dt>
            <dd
              className={`text-lg font-medium flex items-center gap-1 ${
                Number(change) >= ZERO ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {Number(change) >= ZERO ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
              {Number(change).toFixed(FIX_DECIMAL_DIGITS)} (
              {Number(percent_change).toFixed(FIX_DECIMAL_DIGITS)}%)
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
