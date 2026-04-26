'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface WatchlistButtonProps {
  symbol: string;
  company: string;
  isInWatchlist: boolean;
  showTrashIcon?: boolean;
  type?: 'button' | 'icon';
  onWatchlistChange?: (symbol: string, isAdded: boolean) => void;
}

export default function WatchlistButton({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = 'button',
  onWatchlistChange,
}: WatchlistButtonProps) {
  const [isAdded, setIsAdded] = useState(isInWatchlist);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleWatchlist = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement watchlist add/remove logic
      const newStatus = !isAdded;
      setIsAdded(newStatus);
      onWatchlistChange?.(symbol, newStatus);
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (type === 'icon') {
    return (
      <button
        onClick={handleToggleWatchlist}
        disabled={isLoading}
        className="watchlist-icon-btn"
        aria-label={isAdded ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        <Star
          className={cn(
            'star-icon transition-all',
            isAdded && 'watchlist-icon-added'
          )}
          fill={isAdded ? 'currentColor' : 'none'}
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleWatchlist}
      disabled={isLoading}
      className={cn(
        'watchlist-btn transition-colors',
        isAdded && 'watchlist-remove'
      )}
    >
      {isLoading ? 'Loading...' : isAdded ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </button>
  );
}
