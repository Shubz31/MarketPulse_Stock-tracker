'use server';

import { getDateRange } from '@/lib/utils';

const FINNHUB_BASE_URL = process.env.NEXT_PUBLIC_FINNHUB_BASE_URL || 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

interface FinnhubArticle {
  id: string;
  category: string;
  datetime: number;
  headline: string;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

interface FormattedArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: number;
  image?: string;
  symbol?: string;
}

/**
 * Fetch JSON from URL with caching support
 * @param url - Full URL to fetch
 * @param revalidateSeconds - Revalidate cache after N seconds (if provided, uses force-cache)
 * @returns Parsed JSON response
 */
const fetchJSON = async (url: string, revalidateSeconds?: number): Promise<any> => {
  try {
    const options: RequestInit = {
      method: 'GET',
      ...(revalidateSeconds
        ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
        : { cache: 'no-store' }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

/**
 * Validate and format an article
 * @param article - Raw article object
 * @param symbol - Optional stock symbol
 * @returns Formatted article or null if invalid
 */
const formatArticle = (article: any, symbol?: string): FormattedArticle | null => {
  if (!article.headline || !article.url || !article.source) {
    return null;
  }

  return {
    id: article.id || `${article.url}-${article.datetime}`,
    headline: article.headline.trim(),
    summary: article.summary?.trim() || '',
    source: article.source.trim(),
    url: article.url,
    datetime: article.datetime,
    image: article.image || undefined,
    ...(symbol && { symbol }),
  };
};

/**
 * Fetch news for specific symbols or general market news
 * @param symbols - Optional array of stock symbols
 * @returns Array of formatted articles (max 6)
 */
export const getNews = async (symbols?: string[]): Promise<FormattedArticle[]> => {
  try {
    if (!FINNHUB_API_KEY) {
      throw new Error('FINNHUB_API_KEY is not configured');
    }

    const dateRange = getDateRange(5); // Last 5 days
    const articles: FormattedArticle[] = [];
    const seenIds = new Set<string>();

    // If symbols provided, fetch company-specific news
    if (symbols && symbols.length > 0) {
      const cleanSymbols = symbols
        .map((s) => s.trim().toUpperCase())
        .filter((s) => s.length > 0);

      // Round-robin through symbols, max 6 iterations
      let symbolIndex = 0;
      const maxRounds = Math.min(6, cleanSymbols.length * 2);

      for (let round = 0; round < maxRounds && articles.length < 6; round++) {
        const symbol = cleanSymbols[symbolIndex % cleanSymbols.length];
        symbolIndex++;

        try {
          const url = `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${dateRange.from}&to=${dateRange.to}&token=${FINNHUB_API_KEY}`;
          const data = await fetchJSON(url, 3600); // Cache for 1 hour

          if (Array.isArray(data)) {
            for (const article of data) {
              if (articles.length >= 6) break;

              const formatted = formatArticle(article, symbol);
              if (formatted && !seenIds.has(formatted.id)) {
                articles.push(formatted);
                seenIds.add(formatted.id);
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching news for ${symbol}:`, error);
          // Continue with next symbol on error
        }
      }
    }

    // If no symbols or not enough articles, fetch general market news
    if (articles.length < 6) {
      try {
        const url = `${FINNHUB_BASE_URL}/news?category=general&token=${FINNHUB_API_KEY}`;
        const data = await fetchJSON(url, 3600);

        if (Array.isArray(data)) {
          for (const article of data) {
            if (articles.length >= 6) break;

            const formatted = formatArticle(article);
            if (formatted && !seenIds.has(formatted.id)) {
              articles.push(formatted);
              seenIds.add(formatted.id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching general market news:', error);
      }
    }

    // Sort by datetime (newest first)
    return articles
      .sort((a, b) => b.datetime - a.datetime)
      .slice(0, 6);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    throw new Error('Failed to fetch news');
  }
};

/**
 * Get news for a specific symbol
 * @param symbol - Stock symbol
 * @returns Array of formatted articles (max 6)
 */
export const getNewsBySymbol = async (symbol: string): Promise<FormattedArticle[]> => {
  try {
    if (!symbol) {
      return [];
    }

    return await getNews([symbol]);
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error);
    return [];
  }
};

/**
 * Get company quote data
 * @param symbol - Stock symbol
 * @returns Quote data with price, change, etc.
 */
export const getQuote = async (symbol: string) => {
  try {
    if (!symbol || !FINNHUB_API_KEY) {
      return null;
    }

    const url = `${FINNHUB_BASE_URL}/quote?symbol=${symbol.toUpperCase()}&token=${FINNHUB_API_KEY}`;
    const data = await fetchJSON(url, 300); // Cache for 5 minutes

    return data;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
};
