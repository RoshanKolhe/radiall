// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetToolTypes() {
  const URL = endpoints.toolType.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshToolTypes = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    toolTypes: data || [],
    toolTypesLoading: isLoading,
    toolTypesError: error,
    toolTypesValidating: isValidating,
    toolTypesEmpty: !isLoading && !data?.length,
    refreshToolTypes, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetToolType(toolTypeId) {
  const URL = toolTypeId ? [endpoints.toolType.details(toolTypeId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      toolType: data,
      toolTypeLoading: isLoading,
      toolTypeError: error,
      toolTypeValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetToolTypesWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.toolType.filterList(filter);
  } else {
    URL = endpoints.toolType.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterToolTypes = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredToolTypes: data || [],
    filteredToolTypesLoading: isLoading,
    filteredToolTypesError: error,
    filteredToolTypesValidating: isValidating,
    filteredToolTypesEmpty: !isLoading && !data?.length,
    refreshFilterToolTypes, // Include the refresh function separately
  };
}

export function useGetDashboardCounts() {
  const URL = endpoints.toolType.getDashboradCounts;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshDashboardCounts = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    dashboardCounts: data || [],
    isLoading,
    error,
    isValidating,
    refreshDashboardCounts,
  };
}
