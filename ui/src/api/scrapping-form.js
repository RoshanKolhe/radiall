// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetScrappingForm(toolId) {
  const URL = toolId ? [endpoints.scrappingForm.details(toolId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      scrappingForm: data?.data,
      scrappingFormLoading: isLoading,
      scrappingFormError: error,
      scrappingFormValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}