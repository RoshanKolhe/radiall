// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetHistoryCards() {
  const URL = endpoints.historyCard.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshHistoryCards = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    historyCards: data || [],
    historyCardsLoading: isLoading,
    historyCardsError: error,
    historyCardsValidating: isValidating,
    historyCardsEmpty: !isLoading && !data?.length,
    refreshHistoryCards, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetHistoryCard(historyCardId) {
  const URL = historyCardId ? [endpoints.historyCard.details(historyCardId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      historyCard: data,
      historyCardLoading: isLoading,
      historyCardError: error,
      historyCardValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetHistoryCardsWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.historyCard.filterList(filter);
  } else {
    URL = endpoints.historyCard.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterHistoryCards = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredHistoryCards: data || [],
    filteredHistoryCardsLoading: isLoading,
    filteredHistoryCardsError: error,
    filteredHistoryCardsValidating: isValidating,
    filteredHistoryCardsEmpty: !isLoading && !data?.length,
    refreshFilterHistoryCards, // Include the refresh function separately
  };
}
