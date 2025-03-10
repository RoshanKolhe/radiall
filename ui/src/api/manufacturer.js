// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetManufacturers() {
  const URL = endpoints.manufacturer.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshManufacturers = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    manufacturers: data || [],
    manufacturersLoading: isLoading,
    manufacturersError: error,
    manufacturersValidating: isValidating,
    manufacturersEmpty: !isLoading && !data?.length,
    refreshManufacturers, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetManufacturer(manufacturerId) {
  const URL = manufacturerId ? [endpoints.manufacturer.details(manufacturerId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      manufacturer: data,
      manufacturerLoading: isLoading,
      manufacturerError: error,
      manufacturerValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetManufacturersWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.manufacturer.filterList(filter);
  } else {
    URL = endpoints.manufacturer.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterManufacturers = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredManufacturers: data || [],
    filteredManufacturersLoading: isLoading,
    filteredManufacturersError: error,
    filteredManufacturersValidating: isValidating,
    filteredManufacturersEmpty: !isLoading && !data?.length,
    refreshFilterManufacturers, // Include the refresh function separately
  };
}
