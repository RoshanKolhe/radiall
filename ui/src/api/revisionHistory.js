// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetRevisionHistories() {
  const URL = endpoints.revisionHistory.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshRevisionHistories = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    revisionHistories: data || [],
    revisionHistoriesLoading: isLoading,
    revisionHistoriesError: error,
    revisionHistoriesValidating: isValidating,
    revisionHistoriesEmpty: !isLoading && !data?.length,
    refreshRevisionHistories, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetRevisionHistory(revisionHistoryId) {
  const URL = revisionHistoryId ? [endpoints.revisionHistory.details(revisionHistoryId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      revisionHistory: data,
      revisionHistoryLoading: isLoading,
      revisionHistoryError: error,
      revisionHistoryValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetRevisionHistoriesWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.revisionHistory.filterList(filter);
  } else {
    URL = endpoints.revisionHistory.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterRevisionHistories = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredRevisionHistories: data || [],
    filteredRevisionHistoriesLoading: isLoading,
    filteredRevisionHistoriesError: error,
    filteredRevisionHistoriesValidating: isValidating,
    filteredRevisionHistoriesEmpty: !isLoading && !data?.length,
    refreshFilterRevisionHistories, // Include the refresh function separately
  };
}
