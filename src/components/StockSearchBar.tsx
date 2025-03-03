"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useClickOutside } from "@/hooks/useClickOutside";

interface Suggestion {
  symbol: string;
  instrument_name: string;
  exchange: string;
}

const StockSearchBar = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: suggestions = [], isLoading } = useQuery<Suggestion[]>({
    queryKey: ["stockSearch", debouncedQuery],
    queryFn: async () => {
      if (debouncedQuery.length < 2) return [];
      const response = await fetch(
        `https://api.twelvedata.com/symbol_search?symbol=${debouncedQuery}&apikey=${process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY}`
      );
      const data = await response.json();
      return data.data || [];
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  useClickOutside(wrapperRef, () => setIsOpen(false));

  useEffect(() => {
    setIsOpen(debouncedQuery.length >= 2);
  }, [debouncedQuery, suggestions]);

  const handleSelect = (exchange: string, symbol: string) => {
    router.push(`/stocks/${exchange}/${symbol}`);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stocks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8 lg:w-[480px]"
        />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border bg-popover shadow-md">
          <div className="max-h-[300px] overflow-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.symbol}-${index}`}
                onClick={() =>
                  handleSelect(suggestion.exchange, suggestion.symbol)
                }
                className="flex w-full items-center justify-between px-4 py-2 hover:bg-accent hover:text-accent-foreground [&>span]:text-left"
              >
                <span className="font-medium w-1/5">{suggestion.symbol}</span>
                <span className="text-sm text-muted-foreground w-3/5">
                  {suggestion.instrument_name}
                </span>
                <span className="text-sm text-muted-foreground w-1/5">
                  {suggestion.exchange}
                </span>
              </button>
            ))}
            {suggestions.length === 0 && !isLoading && (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockSearchBar;
