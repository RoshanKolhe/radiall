// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetMainatainanceChecklistPoints() {
  const URL = endpoints.maintainanceChecklist.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshChecklists = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    checklists: data || [],
    checklistsLoading: isLoading,
    checklistsError: error,
    checklistsValidating: isValidating,
    checklistsEmpty: !isLoading && !data?.length,
    refreshChecklists, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetMaintainanceChecklistById(id) {
  const URL = id ? [endpoints.maintainanceChecklist.details(id)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      maintainanceChecklist: data,
      maintainanceChecklistLoading: isLoading,
      maintainanceChecklistError: error,
      maintainanceChecklistValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetMaintainanceChecklistWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.maintainanceChecklist.filterList(filter);
  } else {
    URL = endpoints.maintainanceChecklist.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshMaintainanceChecklists = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    maintainanceChecklists: data || [],
    maintainanceChecklistsLoading: isLoading,
    maintainanceChecklistsError: error,
    maintainanceChecklistsValidating: isValidating,
    maintainanceChecklistsEmpty: !isLoading && !data?.length,
    refreshMaintainanceChecklists, // Include the refresh function separately
  };
}
