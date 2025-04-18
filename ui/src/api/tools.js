// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetTools() {
  const URL = endpoints.tools.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshTools = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    tools: data?.data || [],
    toolsLoading: isLoading,
    toolsError: error,
    toolsValidating: isValidating,
    toolsEmpty: !isLoading && !data?.data?.length,
    refreshTools, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetTool(toolId) {
  const URL = toolId ? [endpoints.tools.details(toolId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      tool: data?.data,
      toolLoading: isLoading,
      toolError: error,
      toolValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetToolsWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.tools.filterList(filter);
  } else {
    URL = endpoints.tools.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterTools = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredTools: data?.data || [],
    filteredToolsLoading: isLoading,
    filteredToolsError: error,
    filteredToolsValidating: isValidating,
    filteredToolsEmpty: !isLoading && !data?.data?.length,
    refreshFilterTools,
  };
}
