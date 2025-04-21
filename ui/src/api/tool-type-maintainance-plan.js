// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetToolTypeMaintainancePlan(toolId) {
  const URL = toolId ? [endpoints.toolType.plan(toolId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      maintainancePlan: data?.data,
      maintainancePlanLoading: isLoading,
      maintainancePlanError: error,
      maintainancePlanValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}