// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetInventorys() {
  const URL = endpoints.spare.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshInventorys = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    spares: data || [],
    sparesLoading: isLoading,
    sparesError: error,
    sparesValidating: isValidating,
    sparesEmpty: !isLoading && !data?.length,
    refreshInventorys, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetInventory(spareId) {
  const URL = spareId ? [endpoints.spare.details(spareId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      spare: data,
      spareLoading: isLoading,
      spareError: error,
      spareValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetInventorysWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.spare.filterList(filter);
  } else {
    URL = endpoints.spare.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterInventorys = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredInventorys: data || [],
    filteredInventorysLoading: isLoading,
    filteredInventorysError: error,
    filteredInventorysValidating: isValidating,
    filteredInventorysEmpty: !isLoading && !data?.length,
    refreshFilterInventorys, // Include the refresh function separately
  };
}
