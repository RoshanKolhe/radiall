// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetStorageLocations() {
  const URL = endpoints.storageLocation.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshStorageLocations = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    storageLocations: data || [],
    storageLocationsLoading: isLoading,
    storageLocationsError: error,
    storageLocationsValidating: isValidating,
    storageLocationsEmpty: !isLoading && !data?.length,
    refreshStorageLocations, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetStorageLocation(storageLocationId) {
  const URL = storageLocationId ? [endpoints.storageLocation.details(storageLocationId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      storageLocation: data,
      storageLocationLoading: isLoading,
      storageLocationError: error,
      storageLocationValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetStorageLocationsWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.storageLocation.filterList(filter);
  } else {
    URL = endpoints.storageLocation.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterStorageLocations = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredStorageLocations: data || [],
    filteredStorageLocationsLoading: isLoading,
    filteredStorageLocationsError: error,
    filteredStorageLocationsValidating: isValidating,
    filteredStorageLocationsEmpty: !isLoading && !data?.length,
    refreshFilterStorageLocations, // Include the refresh function separately
  };
}
