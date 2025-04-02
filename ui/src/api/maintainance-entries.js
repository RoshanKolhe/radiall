// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetMaintainanceEntries(toolId) {
  const URL = toolId ? [endpoints.maintainancePlan.entries(toolId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      maintainanceEntries: data,
      maintainanceEntriesLoading: isLoading,
      maintainanceEntriesError: error,
      maintainanceEntriesValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}