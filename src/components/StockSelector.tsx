'use client';

import { useCallback, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ZERO } from '@/constants/magicNumbers';
import { Stock } from '@/services/stock/types';

interface StockSelectorProps {
  stocks: Stock[];
  selectedStocks: string[];
  onSelect: (symbols: string[]) => void;
}

export function StockSelector({
  stocks = [],
  selectedStocks = [],
  onSelect,
}: StockSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleSelectAll = useCallback(() => {
    onSelect(stocks.map((s) => s.symbol));
    setOpen(false);
  }, [stocks, onSelect]);

  const handleSelectStock = useCallback(
    (symbol: string) => {
      if (selectedStocks.includes(symbol)) {
        onSelect(selectedStocks.filter((s) => s !== symbol));
      } else {
        onSelect([...selectedStocks, symbol]);
      }
    },
    [selectedStocks, onSelect],
  );

  const handleRemoveStock = useCallback(
    (symbol: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect(selectedStocks.filter((s) => s !== symbol));
    },
    [selectedStocks, onSelect],
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-dashed"
            role="combobox"
            aria-expanded={open}
          >
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
            <span className="ml-2">
              {selectedStocks.length === ZERO
                ? 'Select stocks'
                : `${selectedStocks.length} selected`}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <div className="overflow-hidden rounded-md border border-input bg-popover text-popover-foreground">
            <button
              className="flex cursor-pointer items-center justify-between px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground w-full"
              onClick={handleSelectAll}
            >
              <span>All Stocks</span>
              {selectedStocks.length === stocks.length && (
                <Check className="h-4 w-4" />
              )}
            </button>
            {stocks.map((stock) => (
              <button
                key={stock.symbol}
                className="flex cursor-pointer items-center justify-between px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground w-full"
                onClick={() => handleSelectStock(stock.symbol)}
              >
                <span>{stock.symbol}</span>
                {selectedStocks.includes(stock.symbol) && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-1">
        {selectedStocks.map((symbol) => (
          <Badge
            key={symbol}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {symbol}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={(e) => handleRemoveStock(symbol, e)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}
