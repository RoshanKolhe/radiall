// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetPreviousInternalValidationForm(id) {
  const URL = id ? [endpoints.internalValidationForm.history(id)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      internalValidationForm: data?.data,
      internalValidationFormLoading: isLoading,
      internalValidationFormError: error,
      internalValidationFormValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}