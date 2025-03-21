// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetSpares() {
  const URL = endpoints.spare.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshSpares = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    spares: data || [],
    sparesLoading: isLoading,
    sparesError: error,
    sparesValidating: isValidating,
    sparesEmpty: !isLoading && !data?.length,
    refreshSpares, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetSpare(spareId) {
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

export function useGetSparesWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.spare.filterList(filter);
  } else {
    URL = endpoints.spare.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterSpares = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredSpares: data || [],
    filteredSparesLoading: isLoading,
    filteredSparesError: error,
    filteredSparesValidating: isValidating,
    filteredSparesEmpty: !isLoading && !data?.length,
    refreshFilterSpares, // Include the refresh function separately
  };
}
