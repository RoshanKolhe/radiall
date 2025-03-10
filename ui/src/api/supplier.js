// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetSuppliers() {
  const URL = endpoints.supplier.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshSuppliers = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    suppliers: data || [],
    suppliersLoading: isLoading,
    suppliersError: error,
    suppliersValidating: isValidating,
    suppliersEmpty: !isLoading && !data?.length,
    refreshSuppliers, // Include the refresh function separately
  };
}

// ----------------------------------------------------------------------

export function useGetSupplier(supplierId) {
  const URL = supplierId ? [endpoints.supplier.details(supplierId)] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      supplier: data,
      supplierLoading: isLoading,
      supplierError: error,
      supplierValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetSuppliersWithFilter(filter) {
  let URL;
  if (filter) {
    URL = endpoints.supplier.filterList(filter);
  } else {
    URL = endpoints.supplier.list;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshFilterSuppliers = () => {
    // Use the `mutate` function to trigger a revalidation
    mutate();
  };

  return {
    filteredSuppliers: data || [],
    filteredSuppliersLoading: isLoading,
    filteredSuppliersError: error,
    filteredSuppliersValidating: isValidating,
    filteredSuppliersEmpty: !isLoading && !data?.length,
    refreshFilterSuppliers, // Include the refresh function separately
  };
}
