'use client';

import { useStore } from '@/lib/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ZERO } from '@/constants/magicNumbers';

const FIX_DECIMAL_DIGITS = 2;

export function Portfolio() {
  const { user, stocks } = useStore();

  if (!user) return null;

  const getStockCurrentPrice = (symbol: string) => {
    return stocks.find((s) => s.symbol === symbol)?.price || ZERO;
  };

  const calculatePositionValue = (symbol: string, quantity: number) => {
    const currentPrice = getStockCurrentPrice(symbol);
    return currentPrice * quantity;
  };

  const calculateProfitLoss = (symbol: string) => {
    const position = user.portfolio[symbol];
    if (!position) return ZERO;
    const currentValue = calculatePositionValue(symbol, position.quantity);
    const costBasis = position.averagePrice * position.quantity;
    return currentValue - costBasis;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Portfolio</CardTitle>
        <CardDescription>Current positions and performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(user.portfolio).map(([symbol, position]) => (
            <div
              key={symbol}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{symbol}</h3>
                <p className="text-sm text-muted-foreground">
                  {position.quantity} shares @ $
                  {position.averagePrice.toFixed(FIX_DECIMAL_DIGITS)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  $
                  {calculatePositionValue(symbol, position.quantity).toFixed(
                    FIX_DECIMAL_DIGITS,
                  )}
                </p>
                <p
                  className={`text-sm ${
                    calculateProfitLoss(symbol) >= ZERO
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {calculateProfitLoss(symbol) >= ZERO ? '+' : ''}$
                  {calculateProfitLoss(symbol).toFixed(FIX_DECIMAL_DIGITS)}
                </p>
              </div>
            </div>
          ))}
          {Object.keys(user.portfolio).length === ZERO && (
            <p className="text-sm text-muted-foreground">
              No positions yet. Start trading to build your portfolio!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
