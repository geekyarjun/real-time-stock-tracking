'use client';

import { useState } from 'react';
import { useStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

interface WatchlistButtonProps {
  symbol: string;
  exchange: string;
}

export function WatchlistButton({ symbol, exchange }: WatchlistButtonProps) {
  const { data: session } = useSession();
  const { watchlist, addToWatchlist, removeFromWatchlist } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isInWatchlist = watchlist.some((item) => item.symbol === symbol);

  const handleClick = async () => {
    if (!session?.user?.id) return;

    try {
      setIsLoading(true);
      if (isInWatchlist) {
        await removeFromWatchlist(session.user.id, symbol);
        toast({
          description: `${symbol} removed from watchlist`,
        });
      } else {
        await addToWatchlist(session.user.id, symbol, exchange);
        toast({
          description: `${symbol} added to watchlist`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        description: 'Failed to update watchlist',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) return null;

  return (
    <Button
      variant={isInWatchlist ? 'secondary' : 'outline'}
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
    >
      <Star className={`h-4 w-4 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
      {isInWatchlist ? 'Watchlisted' : 'Add to Watchlist'}
    </Button>
  );
}
