// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetStations() {
  const URL = endpoints.station.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshStations = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    stations: data || [],
    stationsLoading: isLoading,
    stationsError: error,
    stationsValidating: isValidating,
    stationsEmpty: !isLoading && !data?.length,
    refreshStations, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetStation(stationId) {
  const URL = stationId ? [endpoints.station.details(stationId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      station: data,
      stationLoading: isLoading,
      stationError: error,
      stationValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetStationsWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.station.filterList(filter);
  } else {
    URL = endpoints.station.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterStations = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredStations: data || [],
    filteredStationsLoading: isLoading,
    filteredStationsError: error,
    filteredStationsValidating: isValidating,
    filteredStationsEmpty: !isLoading && !data?.length,
    refreshFilterStations, // Include the refresh function separately
  };
}
