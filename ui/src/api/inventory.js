// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetInventorys() {
  const URL = endpoints.inventory.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshInventorys = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    inventorys: data || [],
    inventorysLoading: isLoading,
    inventorysError: error,
    inventorysValidating: isValidating,
    inventorysEmpty: !isLoading && !data?.length,
    refreshInventorys, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetInventory(inventoryId) {
  const URL = inventoryId ? [endpoints.inventory.details(inventoryId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      inventory: data,
      inventoryLoading: isLoading,
      inventoryError: error,
      inventoryValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetInventorysWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.inventory.filterList(filter);
  } else {
    URL = endpoints.inventory.list;
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
